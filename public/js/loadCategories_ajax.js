(async () => {
    const categories = document.querySelector('#item-categories');
    const response = await fetch('http://localhost:5000/items/categories');
    const data = await response.json();

    let output = '<option value="">Choose Category</option>';
    data.forEach(category => {
        output += `<option value="${category.category_id}">${category.category_name}</option>`;
    });

    categories.innerHTML = output;
})();
