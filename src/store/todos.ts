// Utilities
import { defineStore } from 'pinia'
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, getFirestore, orderBy, query } from "firebase/firestore";
import { Todo } from '@/types/interface';

export const useTodosStore = defineStore('todo', {
  state: (): { todos: Todo[] } => ({
    todos: []
  }),
  getters:{
    find: state => (todoId:number) => state.todos.find(todo => todo.id == todoId),
    findIndex: state => (todoId:number) => state.todos.findIndex(todo => todo.id == todoId),
    pendingTodos: state => () => state.todos.filter(todo => todo.status == false),
    completeTodos: state => () => state.todos.filter(todo => todo.status == true),
  },
  actions: {
    async read(){
      const db = getFirestore();
      const todosRef = collection(db, "todos");
      const q = query(todosRef, orderBy("id","desc"));
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.todos.push({
          title: doc.data().title,
          id: doc.data().id,
          status: doc.data().status,
          _id:doc.id
        })
      });
    },
    async create(dataum:Todo) {
      const db = getFirestore();
      try {
        const docRef = await addDoc(collection(db, "todos"), dataum);
        this.todos.unshift({...dataum,_id:docRef.id})
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async update(dataum:Todo) {
      const db = getFirestore();
      try{
        const docRef = doc(db, "todos", dataum._id)
        await updateDoc(docRef,{title:dataum.title})

        let index = this.findIndex(dataum.id)
        this.todos.splice(index,1,dataum)
      }
      catch(error){
        console.log("Something went wrong",error)
      }
    },
    async remove(id:number,_id:string) {
      const db = getFirestore();
      
      try{
        const docRef = doc(db, "todos", _id)
        await deleteDoc(docRef)
        
        let index = this.findIndex(id)
        this.todos.splice(index,1)
      }
      catch(error){
        console.log("Something went wrong",error)
      }
      
    },
    async uspdateStatus(id:number,status:boolean){
      let todo = this.find(id)

      if(todo){
        const db = getFirestore();
        try{
          const docRef = doc(db, "todos", todo._id)
          await updateDoc(docRef,{status:status})

          let index = this.findIndex(id)
          todo.status = status
          this.todos.splice(index,1,todo)
        }
        catch(error){
          console.log("Something went wrong",error)
        }
      }
      
    }
  }
})
