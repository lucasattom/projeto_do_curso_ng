import { NgModule } from "@angular/core";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { CommonModule } from "@angular/common";
import { AlertComponent } from "./alert/alert.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective
    ],
    imports:[CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule {}