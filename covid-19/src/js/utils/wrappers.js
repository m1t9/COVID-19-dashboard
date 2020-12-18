export default function createElementWrap(elementName, className, innerText, attribute, classList) {
  const element = document.createElement(elementName);

  if (className) {
    element.className = className;
  }

  if (innerText) {
    element.innerHTML = innerText;
  }

  if (attribute) {
    element.setAttribute(`data-${className}`, attribute);
  }

  if (classList) {
    element.classList.add(classList);
  }

  return element;
}
