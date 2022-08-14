let courses;
let messages;
let desc;

let activeCat = document.querySelector(".categoriesList").children[0];
activeCat.classList.add("activeCategory");

const loadCourses = async ()=>{
    const load = await fetch("http://localhost:3000/courses");
    const res = await load.json();
    courses = res;
}

const loadMessages =  async ()=>{
    const load = await fetch("http://localhost:3000/message");
    const res = await load.json();
    messages = res;
}

const loadDesc =  async ()=>{
    const load = await fetch("http://localhost:3000/desc");
    const res = await load.json();
    desc = res;
}



const displayCatMessage = (category = activeCat.textContent.toLowerCase())=>{
    document.querySelector("#message").innerHTML=messages[category];
}

const displayCatDesc = (category = activeCat.textContent.toLowerCase())=>{
    document.querySelector("#desc").innerHTML=desc[category];
}

const displayCourses = (category = activeCat.textContent.toLowerCase())=>{

    const coursesDiv = document.createElement("div");



    courses[category].forEach(course => {
        const courseCard = createCourseCard(course, category);
        coursesDiv.appendChild(courseCard);
    }); 
    document.querySelector("#courses").remove();
    coursesDiv.id = "courses";
    document.querySelector("#category").appendChild(coursesDiv);

}

const createCourseCard = (courseInfo,category = activeCat.textContent.toLowerCase())=>{
    const courseCard = document.createElement("div");
    courseCard.classList.add("course");
    const courseImg = document.createElement("img");
    courseImg.src = "assets/"+category+"/course"+courseInfo.id+".jpg";
    courseCard.appendChild(courseImg);
    const courseName = document.createElement("h4");
    courseName.textContent = courseInfo.name;
    courseName.classList.add("courseName");
    courseCard.appendChild(courseName);

    const instructor = document.createElement("h5");
    instructor.textContent = courseInfo.instructor;
    instructor.classList.add("instructor");
    courseCard.appendChild(instructor);

    const rating = document.createElement("div");
    rating.textContent = courseInfo.rating;
    rating.classList.add("rating");

    for(let i=0;i<Math.floor(courseInfo.rating);i++){
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
    const prices = document.createElement("div");
    const currentPrice = document.createElement("span");
    const oldPrice = document.createElement("span");
    currentPrice.classList.add("price");
    oldPrice.classList.add("oldPrice");
    currentPrice.textContent = `E£${courseInfo.price}`;
    oldPrice.textContent = `E£${courseInfo.oldPrice}`;
    prices.appendChild(currentPrice);
    if(courseInfo.oldPrice)prices.appendChild(oldPrice);
    courseCard.appendChild(prices);
    return courseCard;
}

const categoryList = document.querySelector(".categoriesList");
categoryList.addEventListener("click",(e)=>{
    if(e.target.localName == "li" && activeCat != e.target){
        
        activeCat.classList.remove("activeCategory");
        activeCat = e.target;
        activeCat.classList.add("activeCategory");
        displayCatMessage();
        displayCatDesc();
        displayCourses();
        document.querySelector("#explore").innerHTML = `Explore ${activeCat.innerHTML}`;
    }
})



const start = async ()=>{
    await loadMessages();
    displayCatMessage();
    await loadDesc();
    displayCatDesc();
    await loadCourses();
    displayCourses();   
    document.querySelector("#explore").innerHTML = `Explore ${activeCat.innerHTML}`;
}

start();