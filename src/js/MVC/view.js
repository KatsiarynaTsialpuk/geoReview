module.exports = {
    renderHtml(tamplate, data) {
        return tamplate(data)
    },
    renderBalloonContentBody(data) {
        return `<a href="#" class="ballon_body__link" data-coords="${data.coordinates}">${data.address}</a><br><p>${data.commentText}</p>`
    }
};