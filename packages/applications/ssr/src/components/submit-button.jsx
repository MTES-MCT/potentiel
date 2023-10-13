'use strict';
'use client';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SubmitButton = void 0;
//@ts-ignore
const react_dom_1 = require('react-dom');
function SubmitButton() {
  const { pending } = (0, react_dom_1.experimental_useFormStatus)();
  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}
exports.SubmitButton = SubmitButton;
