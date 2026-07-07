const PRODUCT_REGEX = /(?:\*\*(\d+)\.\s+(.+?)\*\*|(\d+)\.\s+\*\*(.+?)\*\*)\s*[—–-]\s*\$?([\d.]+)/;
const IMAGE_REGEX = /!\[.*?\]\((.+?)\)/;
const DETAILS_REGEX = /^([A-Za-z\s]+)\s*[·•]\s*(.+?)\s*[·•]\s*(?:In Stock\s*[·•]\s*)?Sizes?:\s*(.+)/i;
const CLOSING_REGEX = /^(any of these|like any|would you like|tell me which|just tell me|say\s+\*?\*?['""]?checkout|ready to|let me know)/i;

export function parseAgentResponse(text) {
  if (!text) return { type: 'text', text: '' };

  if (/order\s*summary/i.test(text) || /\|\s*subtotal/i.test(text) || /\|\s*\*\*total\*\*/i.test(text)) {
    return parseCartSummary(text);
  }

  const blocks = text.split(/^---+$/m).filter((b) => b.trim());
  const products = [];

  for (const block of blocks) {
    const product = parseProductBlock(block);
    if (product) products.push(product);
  }

  if (products.length > 0) {
    const beforeProducts = text.split(/---/)[0]?.trim();
    const afterProducts = text.split(/---/).pop()?.trim();

    const isCompleteTheLook = /complete the look/i.test(text);

    let closingText = '';
    if (afterProducts && !PRODUCT_REGEX.test(afterProducts)) {
      closingText = afterProducts;
    }
    if (!closingText) {
      const lastProduct = products[products.length - 1];
      if (lastProduct?.closingLine) {
        closingText = lastProduct.closingLine;
      }
    }

    let introText = '';
    if (beforeProducts && !PRODUCT_REGEX.test(beforeProducts)) {
      introText = beforeProducts;
    }

    return {
      type: 'products',
      products,
      introText,
      closingText,
      isCompleteTheLook,
    };
  }

  return { type: 'text', text };
}

function parseProductBlock(block) {
  const lines = block.trim().split('\n').filter((l) => l.trim());
  const productMatch = block.match(PRODUCT_REGEX);
  if (!productMatch) return null;

  const number = parseInt(productMatch[1] || productMatch[3]);
  const title = (productMatch[2] || productMatch[4]).trim();
  const price = productMatch[5];

  const imageMatch = block.match(IMAGE_REGEX);
  const imageUrl = imageMatch ? imageMatch[1] : null;

  let details = '';
  let description = '';
  let pairingNote = '';

  let closingLine = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (PRODUCT_REGEX.test(trimmed) || IMAGE_REGEX.test(trimmed)) continue;

    if (CLOSING_REGEX.test(trimmed)) {
      closingLine = trimmed;
      continue;
    }

    if (DETAILS_REGEX.test(trimmed)) {
      details = trimmed;
    } else if (/^\*.*\*$/.test(trimmed)) {
      pairingNote = trimmed.replace(/^\*|\*$/g, '');
    } else if (trimmed && !details) {
      details = trimmed;
    } else if (trimmed) {
      description = trimmed;
    }
  }

  let sizes = [];
  const sizesMatch = block.match(/Sizes?:\s*(.+)/i);
  if (sizesMatch) {
    sizes = sizesMatch[1].trim().split(/,\s*/);
  }

  return { number, title, price, imageUrl, details, description, pairingNote, sizes, closingLine };
}

function parseCartSummary(text) {
  const items = [];
  const totals = {};

  const itemMatches = text.matchAll(/\*\*(.+?)\*\*\s*[—–-]\s*(?:Size\s+(\S+)\s*[—–-]\s*)?\$?([\d.]+)/g);
  for (const m of itemMatches) {
    items.push({ name: m[1], size: m[2] || '', price: m[3] });
  }

  const subtotalMatch = text.match(/subtotal\s*\|?\s*\$?([\d.]+)/i);
  const taxMatch = text.match(/tax\s*\(?.*?\)?\s*\|?\s*\$?([\d.]+)/i);
  const shippingMatch = text.match(/shipping\s*\|?\s*(free|\$[\d.]+)/i);
  const totalMatch = text.match(/\*\*total\*\*\s*\|?\s*\*?\*?\$?([\d.]+)/i);

  if (subtotalMatch) totals.subtotal = subtotalMatch[1];
  if (taxMatch) totals.tax = taxMatch[1];
  if (shippingMatch) totals.shipping = shippingMatch[1];
  if (totalMatch) totals.total = totalMatch[1];

  const paymentMatch = text.match(/payment:\s*(.+)/i);
  const payment = paymentMatch ? paymentMatch[1].trim() : '';

  let closingText = '';
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line && !/^\|/.test(line) && !/^---/.test(line) && !/payment/i.test(line) && !/total/i.test(line)) {
      closingText = line;
      break;
    }
  }

  if (items.length > 0 || totals.total) {
    return { type: 'cart', items, totals, payment, closingText };
  }

  return { type: 'text', text };
}
