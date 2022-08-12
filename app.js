let courses;
const loadCourses = async ()=>{
    const load = await fetch("http://localhost:3000/courses");
    const res = await load.json();
    courses = res;
}

const createCourseCard = (courseInfo,category)=>{
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
    prices.appendChild(oldPrice);
    courseCard.appendChild(prices);
    return courseCard;
}

const displayCourses = async (category)=>{

    await loadCourses();

    const coursesDiv = document.createElement("div");

    coursesDiv.classList.add("courses");


    courses[category].forEach(course => {
        const courseCard = createCourseCard(course, category);
        coursesDiv.appendChild(courseCard);
    }); 

    document.querySelector(".category").appendChild(coursesDiv);

}

displayCourses(document.querySelector(".categoriesList").children[0].textContent.toLowerCase());