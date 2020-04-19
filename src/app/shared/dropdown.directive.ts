import { Directive, HostListener, HostBinding, ElementRef } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    // @HostBinding('class') newClass: string = '';  // O que eu fiz e deu certo
    @HostBinding('class.open') isOpen = false;
    @HostListener('document:click', ['$event']) toggleMenu(event: Event) {
        // console.log('something happened')   // O que eu fiz e deu certo
        // if (this.newClass === '') {
        //     this.newClass = 'open';
        // } else {
        //     this.newClass = '';
        // }
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }

    constructor(private elRef: ElementRef) {}
}