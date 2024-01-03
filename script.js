const API_KEY = "api_key=API_KEY_WILL_BE_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL+'/search/movie?'+API_KEY;

const container = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const generTag = document.getElementById('tags');
const previousTag = document.getElementById('prev');
const currentTag = document.getElementById('current');
const nextTag = document.getElementById('next');

const geners = 
[
        {
        "id": 28,
        "name": "Action"
        },
        {
        "id": 12,
        "name": "Adventure"
        },
        {
        "id": 16,
        "name": "Animation"
        },
        {
        "id": 35,
        "name": "Comedy"
        },
        {
        "id": 80,
        "name": "Crime"
        },
        {
        "id": 99,
        "name": "Documentary"
        },
        {
        "id": 18,
        "name": "Drama"
        },
        {
        "id": 10751,
        "name": "Family"
        },
        {
        "id": 14,
        "name": "Fantasy"
        },
        {
        "id": 36,
        "name": "History"
        },
        {
        "id": 27,
        "name": "Horror"
        },
        {
        "id": 10402,
        "name": "Music"
        },
        {
        "id": 9648,
        "name": "Mystery"
        },
        {
        "id": 10749,
        "name": "Romance"
        },
        {
        "id": 878,
        "name": "Science Fiction"
        },
        {
        "id": 10770,
        "name": "TV Movie"
        },
        {
        "id": 53,
        "name": "Thriller"
        },
        {
        "id": 10752,
        "name": "War"
        },
        {
        "id": 37,
        "name": "Western"
        }
]

var selectedGener = [];

var previousPage = 3;
var currentPage = 1;
var nextPage = 2;
var totalPage = 100;

setGener();
function setGener()
{
    generTag.innerHTML = '';
    geners.forEach(gener =>{
        const t = document.createElement('span');
        t.classList.add('tag');
        t.innerHTML = `
        <span id = ${gener.id} class="badge tag rounded-pill text-bg-primary">${gener.name}</span>
        `
        t.addEventListener('click', ()=>{
            if(selectedGener==0)
            {
                selectedGener.push(gener.id);
            }
            else
            {
                if(selectedGener.includes(gener.id))
                {
                    selectedGener.forEach((id,idx) => {
                        if(gener.id==id)
                        {
                            selectedGener.splice(idx, 1);
                        }
                    });
                }
                else
                {
                    selectedGener.push(gener.id);
                }
            }
            console.log(selectedGener);
            getMovies(POPULAR_MOVIE_URL+'&with_genres='+encodeURI(selectedGener.join(',')));
            highlightSelection();
            
        });
        generTag.appendChild(t);
    })
}

function highlightSelection()
{
    const abc = document.querySelectorAll('.tag');
    abc.forEach(tag => {
        tag.classList.remove('text-bg-danger');
    });
    clearBtn();
    if(selectedGener.length!=0)
    {
        selectedGener.forEach(id =>{
            const highlitedTag = document.getElementById(id);
            highlitedTag.classList.add('text-bg-danger');

        });
    }
}

getMovies(POPULAR_MOVIE_URL);

 async function getMovies(url)
{
    await fetch(url).then(res => res.json()).then(data => {
        if(data.results.length != 0)
        {
            currentTag.innerHTML = '';
            showMovies(data.results);
            totalPage = data.total_pages;
            currentPage = data.page;
            previousPage = data.page - 1;
            nextPage = data.page + 1;
            if(currentPage>1){
                previousTag.classList.remove('disabled');
                
            }else{
                previousTag.classList.add('disabled');
            }
            const currentText = document.createElement('a');
            currentText.classList.add('page-link');
            currentText.innerText = currentPage;
            currentTag.appendChild(currentText);
           
        }
        else
        {
            container.innerHTML = `
            <h1>No Results Found</h1>
            `
        }
         
    })
}

function showMovies(data)
{
    alert("are you able to see the contents");
    container.innerHTML = '';
    data.forEach(element => {
        const {title, poster_path, overview} = element;
        const movieEl = document.createElement('div');
        movieEl.classList.add('moviecard');
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: 'http://via.placeholder.com/1080x1580'}" class="card-img-top" alt="${title}">
            <div class="moviecard-body">
              <h5 class="moviecard-title">${title}</h5>
            </div>
            <div class="overview">
            ${overview}
            </div>
        `
        container.appendChild(movieEl);
    });
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const searchItem = search.value;
    selectedGener = [];
    setGener();
    if(searchItem)
    {
        getMovies(SEARCH_URL+'&query='+searchItem);
    }
    else
    {
        getMovies(POPULAR_MOVIE_URL);
    }
});

function clearBtn()
{
    let clearBtn = document.getElementById('clear');
    if(clearBtn)
    {
        clearBtn.classList.add('text-bg-danger');
    }
    else
    {
        let clear = document.createElement('span');
        clear.innerHTML = `
        <span id = "clear" class="badge tag rounded-pill text-bg-danger">Clear x</span>
        `
        clear.addEventListener('click', ()=>{
            selectedGener = [];
            setGener();
            getMovies(POPULAR_MOVIE_URL);
        })
        generTag.append(clear);
    }
}

nextTag.addEventListener('click', () =>{
    
    getMovies(POPULAR_MOVIE_URL + '&page=' + nextPage);
});
previousTag.addEventListener('click', () =>{
    
    getMovies(POPULAR_MOVIE_URL + '&page=' + previousPage);
});
