// The courses object has sub-objects for each category that contains courses information.
let courses;
// The messages is an object that has message for each category eg. "Expand your career opportunities with Python".
let messages;
// The desc is an object that has description for each category eg. "Take one of Udemy’s range of Python courses and learn...".
let desc;

// The activeCat is the category is displayed.
let activeCat = document.querySelector(".categoriesList").children[0];
activeCat.classList.add("activeCategory");

// The hide function changes the display property of element to none.
const hide = (elementid)=>{document.querySelector(elementid).classList.add("disappear");}
// The show function cancels the hide function effect.
const show = (elementid)=>{document.querySelector(elementid).classList.remove("disappear");}

const loadCourses = async ()=>{
    // The loadCourses function loads the courses content from the JSON-Server.
    const load = await fetch("http://localhost:3000/courses");
    const res = await load.json();
    courses = res;
}

const loadMessages =  async ()=>{
    // The loadMessages function loads category messages from the JSON-Server.
    const load = await fetch("http://localhost:3000/message");
    const res = await load.json();
    messages = res;
}

const loadDesc =  async ()=>{
    // The loadDesc function loads category description from the JSON-Server.
    const load = await fetch("http://localhost:3000/desc");
    const res = await load.json();
    desc = res;
}



const displayCatMessage = (category = activeCat.textContent.toLowerCase())=>{
    // The displayCatMessage function displays the message of the active category.
    document.querySelector("#message").innerHTML=messages[category];
}

const displayCatDesc = (category = activeCat.textContent.toLowerCase())=>{
    // The displayCatDesc function displays the description of the active category.
    document.querySelector("#desc").innerHTML=desc[category];
}

const displayCourses = (category = activeCat.textContent.toLowerCase())=>{
    // The displayCourses function displays the courses of the active category.

    // Creating div element to contain the course cards.
    const coursesDiv = document.createElement("div");

    courses[category].forEach(course => {
        // courses[category] is an object containing information about the courses of the active category.
        // Building a course card from information passed.
        const courseCard = createCourseCard(course, category);
        // Appending the courseCard to the coursesDiv
        coursesDiv.appendChild(courseCard);
    }); 
    
    // Remove the old courses.
    document.querySelector("#courses").remove();
    // Applying the styles of the courses container to the new courses container.
    coursesDiv.id = "courses";
    // Placing the new coursesDiv in the page
    document.querySelector("#category").appendChild(coursesDiv);

}

const createCourseCard = (courseInfo)=>{
    //Creaing a course course card
    const courseCard = document.createElement("div");
    courseCard.classList.add("course");

    // Course Image.
    const courseImg = document.createElement("img");
    courseImg.src = "assets/"+courseInfo.cat+"/course"+courseInfo.id+".jpg";
    courseCard.appendChild(courseImg);

    // Course Title.
    const courseName = document.createElement("h4");
    courseName.textContent = courseInfo.name;
    courseName.classList.add("courseName");
    courseCard.appendChild(courseName);

    // Course Instructor.
    const instructor = document.createElement("h5");
    instructor.textContent = courseInfo.instructor;
    instructor.classList.add("instructor");
    courseCard.appendChild(instructor);

    // Course Rating (Number).
    const rating = document.createElement("div");
    rating.textContent = courseInfo.rating;
    rating.classList.add("rating");

    // Course Star Rating.
    for(let i=0;i<Math.floor(courseInfo.rating);i++){
        // Creating star icon.
        const star = document.createElement("i");
        star.className = "fa fa-star";
        star.ariaHidden = true;
        rating.appendChild(star);
    }

    const users = document.createElement("span");
    users.textContent = `(${courseInfo.users})`;
    users.classList.add("users");

    rating.appendChild(users);
    courseCard.appendChild(rating);

    // Prices.
    const prices = document.createElement("div");

    // Current Price.
    const currentPrice = document.createElement("span");
    currentPrice.classList.add("price");
    currentPrice.textContent = `E£${courseInfo.price}`;
    prices.appendChild(currentPrice);

    // Old Price.
    const oldPrice = document.createElement("span");
    oldPrice.classList.add("oldPrice");
    oldPrice.textContent = `E£${courseInfo.oldPrice}`;  
    if(courseInfo.oldPrice)prices.appendChild(oldPrice);

    courseCard.appendChild(prices);
    
    // Bestseller Badge.
    if(courseInfo.bestseller){
        const bestsellerSpan = document.createElement("span");
        bestsellerSpan.textContent = "Bestseller";
        bestsellerSpan.classList.add("bestseller");
        courseCard.appendChild(bestsellerSpan);
    }

    return courseCard;
}


const filter = (targetKeyWords, courseKeywords)=>{
    // The filer function return the number of matching words between the search keywords and the course title.
    let similarity = 0;
    for(let i of targetKeyWords){
        for (let j of courseKeywords){
            if(i==j) similarity++;
        }
    }
    return similarity;
}

const search = (keywords)=>{
    keywords = keywords.toLowerCase();
    keywords = keywords.split(" ");

    // targetCourses stores courses that match the search keywords.
    const targetCourses = []
    for(let catName in courses){
        let cat = courses[catName];
        for(let course of cat){
            
            let courseName = course.name.toLowerCase();
            
            courseName = courseName.split(" ");
            
            const similarity = filter(keywords, courseName);
            course.rank = similarity;
            if(similarity>0)targetCourses.push(course);
        }
    }
    // Sort the targetCourse based on similarity to target keywords.
    targetCourses.sort((a, b) => {
        return b.rank - a.rank;
    });
    // The search is treated like another category.
    courses.search = targetCourses;
}

const categoryList = document.querySelector(".categoriesList");
categoryList.addEventListener("click",(e)=>{
    // If the item clicked is not a list item (The user clicked between two categories) or the the category clicked is the active category nothing happens.
    if(e.target.localName == "li" && activeCat != e.target){
        document.querySelector("#message").classList.remove("Searchresult");
        // Show the category description and the explore button (They may have been hidden => after a search is carried out).
        show("#desc");
        show("#explore");
        // if activeCat may be null => after a search is carried out.
        if(activeCat!=null && activeCat!=undefined)activeCat.classList.remove("activeCategory");
        activeCat = e.target;
        activeCat.classList.add("activeCategory");

        // Display the category message, category description and courses of the active category. 
        displayCatMessage();
        displayCatDesc();
        displayCourses();
        document.querySelector("#explore").innerHTML = `Explore ${activeCat.innerHTML}`;
    }
});

const searchbutton = document.querySelector("#searchbutton");
const searchbar = document.querySelector(".searchbar");

searchbutton.addEventListener("click",()=>{
    event.preventDefault();
    if(searchbar.value != ""){
        // If the searchbar has no input nothing will happen.
        // The search attribute is cleared from the previous search.
        courses.search = [];
        // The matching courses are filterd
        search(searchbar.value);
        // The search is treated like a category and its courses are displayed.
        displayCourses("search");
        // All categories become inactive.
        if(activeCat != null)activeCat.classList.remove("activeCategory");
        activeCat = null;
        // The category message is styled diffrently to report the number of result.
        document.querySelector("#message").classList.add("Searchresult");
        // The description and explore button are hidden.
        hide("#desc");
        hide("#explore");
        document.querySelector("#message").innerHTML = `${courses.search.length} result(s) for "${searchbar.value}"`;
    }

});


const start = async ()=>{
    // The Start routine:
    await loadMessages();
    displayCatMessage();
    await loadDesc();
    displayCatDesc();
    await loadCourses();
    displayCourses();   
    document.querySelector("#explore").innerHTML = `Explore ${activeCat.innerHTML}`;
}

start();