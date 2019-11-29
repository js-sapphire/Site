const menus = ['me', 'weekdays', 'weekends', 'ambition', 'reachMe'];

const showMenu = (_event, menuToShow) => {
    if(!menuToShow){
        return;
    }

    // Hide other menus and make other buttons inactive
    menus.forEach(menu => {
        if(menu === menuToShow){
            return;
        }
        const menuToHideElement = document.getElementById(`${menu}Menu`);
        const inactiveButtonElement = document.getElementById(`${menu}Button`);
        menuToHideElement.style.display = 'none'; 
        inactiveButtonElement.className = inactiveButtonElement.className.replace(" active", "");
    })

    // Make selected button active
    event.currentTarget.className += " active"; 

    // Show selected menu
    const menuToShowElement = document.getElementById(`${menuToShow}Menu`);
    menuToShowElement.style.display = 'flex';
}
