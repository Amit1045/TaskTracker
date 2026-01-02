import { create } from 'zustand'
const baseUrl=import.meta.env.VITE_API_URL;
export const useTask = create((set) => ({
    tasks: [],
    loading: false,
    error: null,
    filters: {
        status: [],
        priority: []
      },

    fetchtasks: async () => {
        set({ loading: true, error: null })
        try {
            const res = await fetch(`${baseUrl}`)
            const result = await res.json()
            if (result.success === "true") {
                set({ tasks: result.data, loading: false })
            } else {
                set({ error: "Failed to load the error" })
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createEntity: async (formData) => {
        if (!formData.title || !formData.dueDate) {
            return { success: false, message: "All fields are required!" };
        }
        try {
            const res = await fetch(`${baseUrl}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    status: formData.status,
                    priority: formData.priority,
                    dueDate:formData.dueDate,
                  }),
            });
            const response = await res.json()
            if (response.success === true) {
                //there is the logic to add another tasks in the cards
                set((state) => ({ tasks: [...state.tasks, response.data] }));
                return { success: true, message: "task created successfully!" }
            } else {
                set({ success:false ,error: "Failed to Create task" })
            }
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                return { success: false, message: error.response.data.message };
            } else {
                return { success: false, message: "Something went wrong." };
            }
        }
    },

    DeleteEntity:async (eid)=>{
        try {
            const res=await fetch(`${baseUrl}/delete/${eid}`,{
                method:"DELETE"
            })
            if(!res.ok){
             return {success: false,message:"Failed to delete product"}
            }
            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== eid),
              }));
              return {success:true,message:"task Deleted successfully!"}

        } catch (error) {
            return {success:false,message:error.message}
        }
    },

    EditEntity: async (id, updatedData) => {
        try {
          const res = await fetch(`http://localhost:8000/api/edit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          });
      
          const data = await res.json(); // parse JSON from backend
      
          if (!res.ok) {
            // backend returned an error
            return { success: false, message: data.message || "Failed to update task" };
          }
      
          // update local state
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task._id === id ? { ...task, ...updatedData } : task
            ),
          }));
      
          return { success: true, message: "task updated successfully!" };
      
        } catch (error) {
          console.error(error);
          return { success: false, message: error.message || "Something went wrong" };
        }
      },
      
      
            
}))
