const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.querySelector(".Habit-list");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
}

function updateDailyStatus() {
    const today = getToday();

    habits.forEach(habit => {
        // Allow the habit to be completed again on a new day
        if (habit.lastCompleted !== today) {
            habit.completed = false;
        }
    });

    saveHabits();
}
function updateDashboard() {
    const totalHabits = document.getElementById("totalHabits");
    const completedToday = document.getElementById("completedToday");
    const bestStreak = document.getElementById("bestStreak");

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    const today = getToday();

    const completedCount = habits.filter(
        habit => habit.lastCompleted === today
    ).length;

    const highestStreak = habits.length > 0
        ? Math.max(...habits.map(habit => habit.streak))
        : 0;

    totalHabits.textContent = habits.length;
    completedToday.textContent = completedCount;
    bestStreak.textContent = highestStreak;

    // Calculate today's progress
    const progress = habits.length > 0
        ? Math.round((completedCount / habits.length) * 100)
        : 0;

    progressText.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;
}

function renderHabits() {
    document.querySelectorAll(".Habit").forEach(card => card.remove());

    habits.forEach((habit, index) => {
        const habitCard = document.createElement("div");
        habitCard.className = "Habit";

        if (habit.completed) {
            habitCard.classList.add("completed");
        }

        habitCard.innerHTML = `
    <div>
        <h3>${habit.name}</h3>
        <p>🔥 Streak: ${habit.streak} day${habit.streak !== 1 ? "s" : ""}</p>
    </div>

    <div class="habit-actions">

        <button onclick="completeHabit(${index})"
                ${habit.completed ? "disabled" : ""}>
            ${habit.completed ? "Completed ✓" : "Complete"}
        </button>

        <button class="delete-btn" onclick="deleteHabit(${index})">
            Delete
        </button>

    </div>
`;

        habitList.appendChild(habitCard);

        updateDashboard();
    });
}

function addHabit() {
    const habitName = habitInput.value.trim();

    if (habitName === "") {
        alert("Please enter a habit!");
        return;
    }

    habits.push({
        name: habitName,
        streak: 0,
        completed: false,
        lastCompleted: null
    });

    saveHabits();
    renderHabits();

    habitInput.value = "";
    habitInput.focus();
}

function completeHabit(index) {
    const habit = habits[index];
    const today = getToday();
    const yesterday = getYesterday();

    if (habit.completed) {
        return;
    }

    // Continue streak if completed yesterday
    if (habit.lastCompleted === yesterday) {
        habit.streak++;
    } 
    // First completion or missed days
    else {
        habit.streak = 1;
    }

    habit.lastCompleted = today;
    habit.completed = true;

    saveHabits();
    renderHabits();
}
function deleteHabit(index) {
    if (confirm("Are you sure you want to delete this habit?")) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
    }
}

addHabitBtn.addEventListener("click", addHabit);

habitInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addHabit();
    }
});

updateDailyStatus();
renderHabits();

