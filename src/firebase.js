import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe2u7nltGtcF-pzQ61yCWsbouHluRjWf8",
  authDomain: "bernardotodoapp.firebaseapp.com",
  projectId: "bernardotodoapp",
  storageBucket: "bernardotodoapp.appspot.com",
  messagingSenderId: "538547251279",
  appId: "1:538547251279:web:34b1df02b992c88fd9623a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Login with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User logged in successfully:", user.uid);
  } catch (error) {
    console.error("Error logging in:", error.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User registered successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error registering user:", error.message);
  }
};

export const onTasksSnapshot = (userId, setTasks) => {
  const userTasksRef = doc(collection(db, "users"), userId);
  const unsubscribe = onSnapshot(userTasksRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const tasksData = userData.tasks || []; // Assuming "tasks" is the name of the nested array
      setTasks(tasksData);
    } else {
      // Handle the case where the document doesn't exist
      console.log(`No tasks found for user with ID: ${userId}`);
      setTasks([]);
    }
  });
  return unsubscribe;
};

export const createTask = async (userId, task) => {
  try {
    const userTasksRef = doc(collection(db, "users"), userId);
    const docSnapshot = await getDoc(userTasksRef);
    const newTask = {
      id: uuidv4(),
      text: task,
      done: false,
      date_added: Timestamp.now(),
    };
    if (docSnapshot.exists()) {
      await updateDoc(userTasksRef, {
        tasks: [newTask, ...docSnapshot.data().tasks],
      });
    } else {
      await setDoc(userTasksRef, { tasks: [newTask] });
    }
    console.log("Task created successfully!");
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const updateTask = async (userId, taskId, updatedTask) => {
  try {
    const userTasksRef = doc(collection(db, "users"), userId);
    const docSnapshot = await getDoc(userTasksRef);

    if (docSnapshot.exists()) {
      const updatedTasks = docSnapshot.data().tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updatedTask,
            date_done: updatedTask.is_done ? Timestamp.now() : null,
          };
        } else {
          return task;
        }
      });

      await updateDoc(userTasksRef, { tasks: updatedTasks });
      console.log("Task updated successfully!");
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    const userTasksRef = doc(collection(db, "users"), userId);
    const docSnapshot = await getDoc(userTasksRef);
    if (docSnapshot.exists()) {
      const updatedTasks = docSnapshot
        .data()
        .tasks.filter((task) => task.id !== taskId);
      // Update the document with the filtered tasks
      await updateDoc(userTasksRef, { tasks: updatedTasks });
      console.log("Task deleted successfully!");
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
