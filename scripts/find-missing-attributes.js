/**
 * This script finds form fields without id or name attributes
 * Run it in the browser console on your pages to identify problematic elements
 */
(function findFormFieldsWithoutIdOrName() {
  const formFields = document.querySelectorAll('input, select, textarea, button[type="submit"]');
  const problemFields = [];
  
  formFields.forEach((field, index) => {
    if (!field.id && !field.name) {
      const path = getElementPath(field);
      problemFields.push({
        element: field,
        tagName: field.tagName,
        type: field.type || 'N/A',
        path: path,
        index: index
      });
    }
  });
  
  if (problemFields.length === 0) {
    console.log('✅ No form fields found without id or name attributes.');
    return;
  }
  
  console.log(`⚠️ Found ${problemFields.length} form fields without id or name attributes:`);
  console.table(problemFields.map(f => ({
    tagName: f.tagName,
    type: f.type,
    path: f.path
  })));
  
  console.log('Detailed information:');
  problemFields.forEach((field, i) => {
    console.log(`Item ${i + 1}:`, field.element);
  });
  
  function getElementPath(el) {
    let path = '';
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector += '#' + el.id;
        return path ? selector + ' > ' + path : selector;
      } else {
        let sib = el.previousElementSibling;
        let nth = 1;
        while (sib) {
          if (sib.nodeName.toLowerCase() === selector) nth++;
          sib = sib.previousElementSibling;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path = path ? selector + ' > ' + path : selector;
      el = el.parentNode;
    }
    return path;
  }
})();
