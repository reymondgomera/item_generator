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

            // textContent is string by default it needed to pase into integer
            let detailsValue = parseInt(spanElement.textContent);
            // set the edit value to value of details (e.g value of quantity, price )
            editInputField.value = detailsValue;

            // execute only when the fields is visible or not contain a class of d-none
            if (inputFieldParentContainer.classList.contains('d-none')) {
                switch (e.target.id) {
                    case 'btn-quantity-edit':
                        console.log(typeof e.target.id);
                        try {
                            const body = { quantity: editInputField.value };

                            // if fields is change value that will the value of the quantity
                            editInputField.addEventListener('change', e => {
                                body.quantity = e.target.value;
                                spanElement.textContent = e.target.value;
                            });

                            const response = await fetch(`http://localhost:5000/items/quantity/${id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body),
                            });

                            const data = await response.json();
                            console.log(data);
                        } catch (err) {
                            console.error(err);
                        }
                        break;

                    case 'btn-price-edit':
                        try {
                            const body = { price: editInputField.value };

                            // if fields is change value that will the value of the quantity
                            editInputField.addEventListener('change', e => {
                                body.quantity = e.target.value;
                                spanElement.textContent = e.target.value;
                            });

                            const response = await fetch(`http://localhost:5000/items/price/${id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body),
                            });

                            const data = await response.json();
                            console.log(data);
                        } catch (err) {
                            console.error(err.message);
                        }

                    default:
                        break;
                }
            }
        }
        if (e.target.nodeName === 'IMG' && e.target.id === 'btn-description-edit') {
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
        }
    });
}, true);
