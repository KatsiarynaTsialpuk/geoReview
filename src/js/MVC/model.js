module.exports = {
    location: null,
    setLocation(data) {
        this.location = data;
    },
    getLocation() {
        return this.location;
    },
    getInputData(formInputs) {
        let inputData = {};

        inputData.date = this.getDate();

        for (let i = 0; i < formInputs.length; i++) {
            const inputDataAttribute = formInputs[i].dataset.key;
            const inputValue = formInputs[i].value;

            inputData[inputDataAttribute] = inputValue;
        }

        return inputData;
    },
    placemarks: null,
    getPlacemarks() {
        if (this.placemarks != null) {
            return this.placemarks;
        } else if (localStorage.placemarks) {
            this.placemarks = JSON.parse(localStorage.placemarks);
            
            return this.placemarks;
        } 
        this.placemarks = [];
        
        return this.placemarks;
        
    },
    updatePlacemarks(placemark, data) {
        if (this.placemarks.length) {
            let hasPlacemark = false;

            this.placemarks.forEach((placemark) => {
                if (placemark.coords.join('') == this.location.coords.join('')) {
                    placemark.reviews.push(data);
                    hasPlacemark = true;
                }
            });

            if (!hasPlacemark) {
                this.placemarks.push(placemark);
            }
        } else {
            this.placemarks.push(placemark);
        }
    },
    getDate() {
        const date = new Date();
        const day = date.getDate();
        const customDay = day < 10 ? '0' + day : day;
        const month = date.getMonth() + 1;
        const customMonth = month < 10 ? '0' + month : month;
        const year = date.getFullYear();
        const hours = date.getHours();
        const customHours = hours < 10 ? '0' + hours : hours;
        const minutes = date.getMinutes();
        const customMinutes = minutes < 10 ? '0' + minutes : minutes;
        const seconds = date.getSeconds();
        const customSeconds = seconds < 10 ? '0' + seconds : seconds;
        const fullDate = `${customDay}.${customMonth}.${year}`;
        const fullTime = `${customHours}:${customMinutes}:${customSeconds}`;

        return `${fullDate} ${fullTime}`;
    }
}