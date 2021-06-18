var update = async (body, url, id) => {
    const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
};

document.querySelectorAll('.btn-edit').forEach(element => {
    element.addEventListener('click', async e => {
        if (
            (e.target.nodeName === 'IMG' && e.target.id === 'btn-quantity-edit') ||
            (e.target.nodeName === 'IMG' && e.target.id === 'btn-price-edit')
        ) {
            /**
             *  textFieldParentContainer - parent container of edit input field
             *  span_element - contains detail's value
             *  link reference = link reference to be use in fetch api
             */
            const id = e.target.dataset.item;
            const inputFieldParentContainer = e.target.parentNode.childNodes[5];
            const spanElement = e.target.parentNode.childNodes[3];
            const editInputField = e.target.parentNode.childNodes[5].childNodes[1];

            // toggle - making element show/hide or vice versa
            inputFieldParentContainer.classList.toggle('d-none');
            spanElement.classList.toggle('d-none');

            // textContent is string by default it needed to pase into float and allowed 2 decimal places
            let detailsValue = parseFloat(spanElement.textContent);
            // set the edit value to value of details (e.g value of quantity, price )
            editInputField.value = detailsValue;

            // (exprected to executed once) if fields is change value of that will be the value of the inputfield and the span field
            editInputField.addEventListener('change', e => {
                if (e.target.value != '') {
                    editInputField.value = e.target.value;
                    spanElement.textContent = e.target.value;
                }
            });

            // execute only when the fields is not visible or contain a class of d-none
            if (inputFieldParentContainer.classList.contains('d-none')) {
                switch (e.target.id) {
                    case 'btn-quantity-edit':
                        try {
                            const body = { quantity: parseInt(editInputField.value) };
                            update(body, 'http://localhost:5000/items/quantity', id);
                            spanElement.textContent = body.quantity;
                        } catch (err) {
                            console.error(err);
                        }
                        break;

                    case 'btn-price-edit':
                        try {
                            const body = { price: parseFloat(editInputField.value).toFixed(2) };
                            update(body, 'http://localhost:5000/items/price', id);

                            spanElement.textContent = body.price; // set the value in a 2 decimal places manner
                        } catch (err) {
                            console.error(err.message);
                        }

                    default:
                        break;
                }
            }
        } else if (e.target.nodeName === 'IMG' && e.target.id === 'btn-description-edit') {
            /**
             *  p_element -  contains description value
             *  text_area -  its the edit description field
             */
            const id = e.target.dataset.item;
            const p_element = e.target.parentNode.nextElementSibling;
            const text_area = e.target.parentNode.nextElementSibling.nextElementSibling;

            // toggle - making element show/hide or vice versa
            p_element.classList.toggle('d-none');
            text_area.classList.toggle('d-none');

            let details_value = p_element.textContent;
            // set the edit value to value of details description
            text_area.value = details_value;

            // (exprected to executed once) if fields is change value of that will be the value of the inputfield and the span field
            text_area.addEventListener('change', e => {
                if (e.target.value != '') {
                    text_area.value = e.target.value;
                    p_element.textContent = e.target.value;
                } else {
                    console.log('use default value');
                }
            });

            // execute only when the fields is not visible or contain a class of d-none
            if (text_area.classList.contains('d-none')) {
                console.log('inside-description-edit');
                const body = { description: text_area.value };
                update(body, 'http://localhost:5000/items/description', id);
                p_element.textContent = body.description;
            }
        }
    });
}, true);

document.querySelector('#btn-delete').addEventListener('click', async e => {
    const id = e.target.dataset.item;
    const response = await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
    const data = await response.json();

    window.location = data.redirect;
});
