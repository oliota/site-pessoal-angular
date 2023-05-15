import { NgModule } from '@angular/core';
import { NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbNavbar, } from './dropdown';
import * as i0 from "@angular/core";
export { NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbNavbar, } from './dropdown';
export { NgbDropdownConfig } from './dropdown-config';
const NGB_DROPDOWN_DIRECTIVES = [
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbNavbar,
];
export class NgbDropdownModule {
}
NgbDropdownModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbDropdownModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownModule, imports: [NgbDropdown,
        NgbDropdownAnchor,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
        NgbNavbar], exports: [NgbDropdown,
        NgbDropdownAnchor,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
        NgbNavbar] });
NgbDropdownModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: NGB_DROPDOWN_DIRECTIVES,
                    exports: NGB_DROPDOWN_DIRECTIVES,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Ryb3Bkb3duL2Ryb3Bkb3duLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFDTixXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsZUFBZSxFQUNmLFNBQVMsR0FDVCxNQUFNLFlBQVksQ0FBQzs7QUFFcEIsT0FBTyxFQUNOLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixlQUFlLEVBQ2YsU0FBUyxHQUNULE1BQU0sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXRELE1BQU0sdUJBQXVCLEdBQUc7SUFDL0IsV0FBVztJQUNYLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsZUFBZTtJQUNmLGVBQWU7SUFDZixTQUFTO0NBQ1QsQ0FBQztBQU1GLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixZQVo3QixXQUFXO1FBQ1gsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsZUFBZTtRQUNmLFNBQVMsYUFMVCxXQUFXO1FBQ1gsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsZUFBZTtRQUNmLFNBQVM7K0dBT0csaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBSjdCLFFBQVE7bUJBQUM7b0JBQ1QsT0FBTyxFQUFFLHVCQUF1QjtvQkFDaEMsT0FBTyxFQUFFLHVCQUF1QjtpQkFDaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcblx0TmdiRHJvcGRvd24sXG5cdE5nYkRyb3Bkb3duQW5jaG9yLFxuXHROZ2JEcm9wZG93blRvZ2dsZSxcblx0TmdiRHJvcGRvd25NZW51LFxuXHROZ2JEcm9wZG93bkl0ZW0sXG5cdE5nYk5hdmJhcixcbn0gZnJvbSAnLi9kcm9wZG93bic7XG5cbmV4cG9ydCB7XG5cdE5nYkRyb3Bkb3duLFxuXHROZ2JEcm9wZG93bkFuY2hvcixcblx0TmdiRHJvcGRvd25Ub2dnbGUsXG5cdE5nYkRyb3Bkb3duTWVudSxcblx0TmdiRHJvcGRvd25JdGVtLFxuXHROZ2JOYXZiYXIsXG59IGZyb20gJy4vZHJvcGRvd24nO1xuZXhwb3J0IHsgTmdiRHJvcGRvd25Db25maWcgfSBmcm9tICcuL2Ryb3Bkb3duLWNvbmZpZyc7XG5cbmNvbnN0IE5HQl9EUk9QRE9XTl9ESVJFQ1RJVkVTID0gW1xuXHROZ2JEcm9wZG93bixcblx0TmdiRHJvcGRvd25BbmNob3IsXG5cdE5nYkRyb3Bkb3duVG9nZ2xlLFxuXHROZ2JEcm9wZG93bk1lbnUsXG5cdE5nYkRyb3Bkb3duSXRlbSxcblx0TmdiTmF2YmFyLFxuXTtcblxuQE5nTW9kdWxlKHtcblx0aW1wb3J0czogTkdCX0RST1BET1dOX0RJUkVDVElWRVMsXG5cdGV4cG9ydHM6IE5HQl9EUk9QRE9XTl9ESVJFQ1RJVkVTLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1vZHVsZSB7fVxuIl19