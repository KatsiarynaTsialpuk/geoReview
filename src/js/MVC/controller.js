import viewTemplate from '../../template/view.hbs';
const yandexApi = require('../modules/initMap.js');
const Model = require('./model.js');
const View = require('./view.js');

module.exports = {
    init() {
        yandexApi.then(api => {
            const placemarks = Model.getPlacemarks();

            if (placemarks) {
                placemarks.forEach((placemark) => {
                    const reviews = placemark.reviews;
                    const myPlacemarks = reviews.map((review) => {
                        const config = {
                            location: review.location,
                            coordinates: placemark.coords,
                            address: placemark.address,
                            date: review.date,
                            commentText: review.commentText
                        };

                        return this.createPlacemark(placemark.coords, config);
                    });

                    api.clusterer.add(myPlacemarks);
                });
            }
        });

        this.hidePopup();
        this.addPlacemark();
        this.clickYandexMap(this);
        this.clickPlacemark(this);
        this.clickBallonLink();
    },
    createPlacemark(coords, config) {
        const myPlacemark = new ymaps.Placemark(coords, {
            balloonContentHeader: config.location,
            balloonContentBody: View.renderBalloonContentBody(config),
            balloonContentFooter: config.date
        });

        return myPlacemark;
    },
    showPopup(reviewObj) {
        const popup = document.querySelector('#popup');
        const popupTitle = popup.querySelector('.popup__title');
        const reviews = document.querySelector('.reviews__list');

        reviews.innerHTML = '';

        if (reviewObj) {
            const coords = reviewObj.coords;
            const address = reviewObj.address;

            Model.setLocation({ coords: coords, address: address });
            popupTitle.innerText = address;
            reviewObj.reviews.forEach(review => {
                reviews.innerHTML += View.renderHtml(viewTemplate, review);
            })
        } else {
            popupTitle.innerText = Model.getLocation().address;
        }

        popup.style.display = 'block';
    },
    clickYandexMap(_this) {
        yandexApi.then(api => {
            api.yandexMap.events.add('click', function(e) {
                const coords = e.get('coords');

                ymaps.geocode(coords).then(result => {
                    const address = result.geoObjects.get(0).properties.get('text');

                    Model.setLocation({ coords: coords, address: address });
                    _this.showPopup();
                });
            });
        });
    },
    clickBallonLink() {
        document.addEventListener('click', (event) => {
            const targetCoords = event.target.dataset.coords;

            if (targetCoords) {
                event.preventDefault();
                const reviews = Model.getPlacemarks();
                const coordsString = targetCoords.split(',');
                const coords = coordsString.map(coord => {
                    return +coord;
                });

                for (let i = 0; i < reviews.length; i++) {
                    const review = reviews[i];

                    if (review.coords.join('') == coords.join('')) {
                        this.showPopup(review);
                        break;
                    }
                }
            }
        });
    },
    clickPlacemark(_this) {
        yandexApi.then(api => {
            api.yandexMap.geoObjects.events.add('click', function(e) {
                const target = e.get('target')

                if (target.options.getName() == 'geoObject') {
                    e.preventDefault();
                    const coords = target.geometry.getCoordinates();
                    const reviews = Model.getPlacemarks();

                    reviews.forEach(review => {
                        if (review.coords == coords) {
                            _this.showPopup(review);
                        }
                    });
                }
            });
        });
    },
    hidePopup() {
        const close = document.querySelector('.btn_action_close');

        close.addEventListener('click', (event) => {
            const popup = event.target.closest('.popup');

            popup.style.display = 'none';
        });
    },
    addPlacemark() {
        const addButton = document.querySelector('#btn_action_add');

        addButton.addEventListener('click', (event) => {
            event.preventDefault();

            const formInputs = document.querySelectorAll('*[data-key]');
            const inputData = Model.getInputData(formInputs);
            const reviews = document.querySelector('.reviews__list');
            const location = Model.getLocation();
            const placemark = {
                coords: location.coords,
                address: location.address,
                reviews: [inputData]
            };
            const config = {
                location: inputData.location,
                coordinates: location.coords,
                address: location.address,
                date: inputData.date,
                commentText: inputData.commentText
            };
            const myPlacemark = this.createPlacemark(location.coords, config);

            reviews.innerHTML += View.renderHtml(viewTemplate, inputData);
            yandexApi.then(api => {
                api.clusterer.add(myPlacemark);
            });

            Model.updatePlacemarks(placemark, inputData);
            localStorage.placemarks = JSON.stringify(Model.getPlacemarks());
        });
    }
};