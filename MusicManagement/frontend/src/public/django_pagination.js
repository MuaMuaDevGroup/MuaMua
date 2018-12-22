import 'angular'


//Register Django Pagination Service
angular.module('mm-app').factory('djangoPage', () => {
    let nowPageIndex = 1;
    let nowMaxPage = 2;
    return function (queryURL) {
        this.queryURL = queryURL;
        this.countEachPage = 10;
        this.nextPage = () => {
            if (nowPageIndex < nowMaxPage)
                nowPageIndex++;
            let url = this.queryURL + "?limit=" + this.countEachPage.toString() + "&offset=" + (this.countEachPage * (nowPageIndex - 1)).toString();
            return url;
        };
        this.previousPage = () => {
            if (nowPageIndex > 0)
                nowPageIndex--;
            let url = this.queryURL + "?limit=" + this.countEachPage.toString() + "&offset=" + (this.countEachPage * (nowPageIndex - 1)).toString();
            return url;
        };
        this.resetPage = () => {
            nowPageIndex = 1;
            nowMaxPage = 2;
            let url = this.queryURL + "?limit=" + this.countEachPage.toString() + "&offset=" + (this.countEachPage * (nowPageIndex - 1)).toString();
            return url;
        };
        this.refreshPage = () => {
            let url = this.queryURL + "?limit=" + this.countEachPage.toString() + "&offset=" + (this.countEachPage * (nowPageIndex - 1)).toString();
            return url;
        };
        this.hasNextPage = () => nowPageIndex < nowMaxPage;
        this.hasPreviousPage = () => nowPageIndex > 1;
        this.filterResult = (response) => {
            nowMaxPage = Math.ceil(response.data.count / this.countEachPage);
            return response.data.results;
        };
    }
});