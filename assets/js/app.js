//================UI CONTROLLER==================
const UICtrl = (function () {

    const sportsButtons = ['Football', 'Nascar', 'Basketball', 'Baseball'];

    const UISelectors = {
        //Buttons
        searchGiffy: '.searchGiffy',
        giffyButton: '.giffyButton',
        luckyGif: '.luckyGif',


        //Inputs
        searchInput: '#search-input',

        //Selects

        //Containers
        giffyButtonsContainer: '.giffyButtonsContainer',
        giffyImagesContainer: '.giffyImagesContainer'

    }

    //Public Methods
    return {
        addGiffyButton: (userInput) => {
            let button = document.createElement('button');
            button.classList = 'btn btn-secondary mr-3 mt-3 giffyButton';
            button.textContent = userInput;
            button.value = userInput;

            document.querySelector(UISelectors.giffyButtonsContainer).appendChild(button);
            
            
        },
        displayGiffyImages: (data, input) => {
            //document.querySelector(UISelectors.giffyImagesContainer).innerHTML = '';
            data.forEach(x => {
                let rating = x.rating;

                //Create image element
                let image = document.createElement('img');

                //set image attributes and classes
                image.src = x.images.fixed_height_still.url;
                image.setAttribute('currentImage', image.src);
                image.setAttribute('stillImage', x.images.fixed_height_still.url);
                image.setAttribute('animatedImage', x.images.fixed_height.url);
                image.classList = 'giffyImages';

                //Create ratings div
                let ratingsDiv = document.createElement('div'),
                    ratingsImg = document.createElement('img');
                ratingsImg.classList = 'rating';
                ratingsDiv.classList = 'd-flex flex-row justify-content-center align-items-center mt-2';
                switch (rating) {
                    case 'g':
                        ratingsImg.src = 'assets/images/g.png';
                        ratingsDiv.appendChild(ratingsImg);
                        break;
                    case 'pg':
                        ratingsImg.src = 'assets/images/pg.png';
                        ratingsDiv.appendChild(ratingsImg);
                        break;
                    case 'pg-13':
                        ratingsImg.src = 'assets/images/pg13.png';
                        ratingsDiv.appendChild(ratingsImg);
                        break;
                    case 'r':
                        ratingsImg.src = 'assets/images/r.png';
                        ratingsDiv.appendChild(ratingsImg);
                        break;
                }

                //create image div
                let imageDiv = document.createElement('div');

                imageDiv.classList = `col-md-3 mt-3 d-flex flex-column align-items-center justify-content-center`;
                imageDiv.appendChild(image);
                imageDiv.appendChild(ratingsDiv);
                document.querySelector(UISelectors.giffyImagesContainer).appendChild(imageDiv);
            });
        
            
            
        },
        toggeleAnimation: (targetImage) => {

            let currentStatus = targetImage.getAttribute('currentimage'),
                stillImage = targetImage.getAttribute('stillimage'),
                animated = targetImage.getAttribute('animatedimage');

            if (currentStatus === stillImage) {
                targetImage.setAttribute('src', animated);
                targetImage.setAttribute('currentimage', animated);
            } else if (currentStatus === animated) {
                targetImage.setAttribute('src', stillImage);
                targetImage.setAttribute('currentimage', stillImage);
            }

        },
        displayStarterButtons: () => {
            sportsButtons.forEach(sport => {
                UICtrl.addGiffyButton(sport);
            });
        },
        getSelectors: () => {
            return UISelectors;
        }
    }

})();



//==============APP CONTROLLER=================
const AppCtrl = (function (UICtrl, $) {
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    const loadEventListeners = () => {
        /*----------------INPUT Events-----------------*/

        /*----------------CLICK Events-----------------*/
        document.querySelector(UISelectors.searchGiffy).addEventListener('click', () => {
            let userInput = document.querySelector(UISelectors.searchInput).value;

            if (userInput !== '') {
                fetchGiffyData(userInput);
                UICtrl.addGiffyButton(userInput);
                document.querySelector(UISelectors.searchInput).value = '';
            }

        });

        document.querySelector(UISelectors.searchInput).addEventListener('keypress', (e) => {
            let userInput = document.querySelector(UISelectors.searchInput).value;

            if (userInput !== '' && e.charCode === 13) {
                fetchGiffyData(userInput);
                UICtrl.addGiffyButton(userInput);
                document.querySelector(UISelectors.searchInput).value = '';
            }

        });

        document.querySelector(UISelectors.giffyButtonsContainer).addEventListener('click', (e) => {

            if (e.target.value) {
                fetchGiffyData(e.target.value);
                
            }

        });

        document.querySelector(UISelectors.giffyImagesContainer).addEventListener('click', (e) => {
            console.log(e.target);
            if (e.target.classList.contains('giffyImages')) {
                UICtrl.toggeleAnimation(e.target);
            }
        });

        document.querySelector(UISelectors.luckyGif).addEventListener('click', randomWord);
        
        document.querySelector('#email').addEventListener('click', ()=>{
            fetchGiffyData('email');
        });
        
        document.querySelector('#trending').addEventListener('click', fetchTrendingGiffyData);

        $('.giffyButton').on( 'click', function() {
              $grid.isotope('shuffle');
            }); 
        
    }


    const randomWord = function (userInput) {
        fetch(`http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=verb&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let reandomWord = data.word;
                fetchGiffyData(reandomWord);
                UICtrl.addGiffyButton(reandomWord);
                document.querySelector(UISelectors.searchInput).value = '';
            });

    }




    //Fetch gif
    const fetchGiffyData = function (userInput) {
         const input = userInput;
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=zwAESCbmAQ3WdqqYxnPu85p5XLAvJSDZ&q=${userInput}&limit=25&offset=0&lang=en`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data = data.data;
                UICtrl.displayGiffyImages(data, input);
            });

    }
    
    //Fetch Trending gif
    const fetchTrendingGiffyData = function () {
        fetch(`https://api.giphy.com/v1/gifs/trending?api_key=zwAESCbmAQ3WdqqYxnPu85p5XLAvJSDZ&limit=25&offset=0`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data = data.data;
                UICtrl.displayGiffyImages(data);
            });

    }

    //Public Methods
    return {
        init: () => {
            loadEventListeners();
            UICtrl.displayStarterButtons();
            
            
            
            

        }
    }

})(UICtrl, $);


AppCtrl.init();
