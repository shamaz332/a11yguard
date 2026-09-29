/** ARIA 1.2 states and properties (without the `aria-` prefix), plus ARIA 1.3 additions. */
export const ARIA_ATTRS = new Set(
  (
    'activedescendant atomic autocomplete braillelabel brailleroledescription busy checked ' +
    'colcount colindex colindextext colspan controls current describedby description details ' +
    'disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid ' +
    'keyshortcuts label labelledby level live modal multiline multiselectable orientation owns ' +
    'placeholder posinset pressed readonly relevant required roledescription rowcount rowindex ' +
    'rowindextext rowspan selected setsize sort valuemax valuemin valuenow valuetext'
  ).split(' ')
);

/** Concrete (non-abstract) ARIA 1.2 roles, plus ARIA 1.3 additions. */
export const ARIA_ROLES = new Set(
  (
    'alert alertdialog application article banner blockquote button caption cell checkbox code ' +
    'columnheader combobox comment complementary contentinfo definition deletion dialog directory ' +
    'document emphasis feed figure form generic grid gridcell group heading image img insertion ' +
    'link list listbox listitem log main mark marquee math menu menubar menuitem ' +
    'menuitemcheckbox menuitemradio meter navigation none note option paragraph presentation ' +
    'progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox ' +
    'sectionfooter sectionheader separator slider spinbutton status strong subscript suggestion ' +
    'superscript switch tab table tablist tabpanel term textbox time timer toolbar tooltip tree ' +
    'treegrid treeitem'
  ).split(' ')
);

/** Autofill field names from the HTML spec (`autocomplete` attribute). */
export const AUTOCOMPLETE_FIELDS = new Set(
  (
    'name honorific-prefix given-name additional-name family-name honorific-suffix nickname ' +
    'username new-password current-password one-time-code organization-title organization ' +
    'street-address address-line1 address-line2 address-line3 address-level4 address-level3 ' +
    'address-level2 address-level1 country country-name postal-code cc-name cc-given-name ' +
    'cc-additional-name cc-family-name cc-number cc-exp cc-exp-month cc-exp-year cc-csc cc-type ' +
    'transaction-currency transaction-amount language bday bday-day bday-month bday-year sex url ' +
    'photo tel tel-country-code tel-national tel-area-code tel-local tel-local-prefix ' +
    'tel-local-suffix tel-extension email impp'
  ).split(' ')
);

/** Natively focusable elements, used to find focusable content hidden from assistive tech. */
export const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
  'select:not([disabled]), textarea:not([disabled]), iframe, summary, audio[controls], ' +
  'video[controls], [contenteditable]:not([contenteditable="false"]), [tabindex]';
