$components = @(
    "avatar",
    "button",
    "separator",
    "sheet",
    "scroll-area",
    "dialog",
    "dropdown-menu",
    "popover",
    "command",
    "card",
    "form",
    "input",
    "checkbox",
    "select",
    "label",
    "textarea",
    "tabs",
    "toast",
    "toggle",
    "progress"
)

foreach ($component in $components) {
    Write-Host "Installing $component..."
    npx shadcn-ui@latest add $component
}