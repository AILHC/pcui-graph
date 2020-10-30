import './style.scss';
import { Label } from '@playcanvas/pcui';
import { Container } from '@playcanvas/pcui';

const CLASS_ContextMenu = 'pcui-contextmenu';
const CLASS_ContextMenu_active = CLASS_ContextMenu + '-active';
const CLASS_ContextMenu_parent = CLASS_ContextMenu + '-parent';
const CLASS_ContextMenu_child = CLASS_ContextMenu + '-child';
const CLASS_ContextMenu_parent_active = CLASS_ContextMenu_parent + '-active';

/**
 * @name ContextMenu
 * @classdesc Represents a context menu.
 */
class ContextMenu {
    /**
     * Creates a new ContextMenu.
     *
     * @param {object} args - The arguments. Extends the pcui.Container constructor arguments. All settable properties can also be set through the constructor.
     */
    constructor(args) {
        if (!args) args = {};

        this._menu = new Container({ dom: args.dom });
        this._menu.contextMenu = this;
        this._menu.class.add(CLASS_ContextMenu);
        this.args = args;
        var menu = this._menu;

        var removeMenu = () => {
            this._menu.class.remove(CLASS_ContextMenu_active);
            document.removeEventListener('click', removeMenu);
        };

        var maxItemsPerColumn = 16;
        var numColumns = Math.floor(args.items.length / maxItemsPerColumn) + 1;

        // if (args.triggerElement) {

        // }
        // if (args.dom) {
        var triggerElement = args.triggerElement || args.dom.parentElement;
        triggerElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menu.class.add(CLASS_ContextMenu_active);

            var maxMenuHeight = Math.min(args.items.length, maxItemsPerColumn) * 27.0;
            var maxMenuWidth = 150.0 * numColumns;

            var left = e.clientX;
            var top = e.clientY;
            if (maxMenuHeight + top > window.innerHeight) {
                var topDiff = (maxMenuHeight + top) - window.innerHeight;
                top -= topDiff;
            }
            if (maxMenuWidth + left > window.innerWidth) {
                var leftDiff = (maxMenuWidth + left) - window.innerWidth;
                left -= leftDiff;
            }
            menu.dom.setAttribute("style", `left: ${left}px; top: ${top}px`);
            document.addEventListener('click', removeMenu);
        });

        if (!args.items) return;

        args.items.forEach((menuItem, i) => {

            var col = Math.floor(i / maxItemsPerColumn);
            var row = i % maxItemsPerColumn;

            var menuItemElement = new Container();
            menuItemElement.dom.setAttribute("style", `left: ${col * 150.0}px; top: ${row * 27.0}px`);
            if (menuItem.onClick) {
                menuItemElement.dom.addEventListener('click', (e) => {
                    e.stopPropagation(); removeMenu(); menuItem.onClick(e);
                });
            }
            var menuItemLabel = new Label({ text: menuItem.text });
            menuItemElement.append(menuItemLabel);
            this._menu.dom.append(menuItemElement.dom);
            if (menuItem.items) {
                menuItem.items.forEach((childItem, j) => {

                    var colj = Math.floor(j / maxItemsPerColumn);
                    var rowj = j % maxItemsPerColumn;

                    var childMenuItemElement = new Container({ class: CLASS_ContextMenu_child });
                    childMenuItemElement.dom.setAttribute("style", `top: ${rowj * 27.0}px; left: ${(colj + 1) * 150.0}px;`);
                    childMenuItemElement.on('click', (e) => {
                        e.stopPropagation(); removeMenu(); childItem.onClick(e);
                    });
                    var childMenuItemLabel = new Label({ text: childItem.text });
                    childMenuItemElement.append(childMenuItemLabel);
                    menuItemElement.append(childMenuItemElement);
                });
                menuItemElement.class.add(CLASS_ContextMenu_parent);
            }
            menuItemElement.dom.addEventListener('mouseover', (e) => {
                // if (!e.fromElement.classList.contains('pcui-contextmenu-parent')) return;
                this._menu.forEachChild(node => node.class.remove(CLASS_ContextMenu_parent_active));
                menuItemElement.class.add(CLASS_ContextMenu_parent_active);

                var maxMenuHeight = menuItem.items ? Math.min(args.items.length, maxItemsPerColumn) * 27.0 : 0.0;
                var maxMenuWidth = 150.0 * numColumns;

                var left = e.clientX + maxMenuWidth > window.innerWidth ? - maxMenuWidth + 2.0 : maxMenuWidth;
                var top = 0;
                if (e.clientY + maxMenuHeight > window.innerHeight) {
                    top = - maxMenuHeight + 27.0;
                }
                menuItemElement.forEachChild((node, j) => {
                    if (j === 0) return;

                    var colj = Math.floor(j / maxItemsPerColumn);
                    var rowj = j % maxItemsPerColumn;

                    node.dom.setAttribute("style", `top: ${top + (rowj - 1) * 27.0}px; left: ${left + (colj * 150.0)}px;`);
                });
            });
        });
    }
}

export {
    ContextMenu
};
export default ContextMenu;
