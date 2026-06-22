import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const API_URL = 'http://127.0.0.1:5000/api/tasks';

  // Fetch all tasks from our Flask API data endpoint
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Operation: Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      if (response.ok) {
        setNewContent('');
        fetchTasks(); // Reload layout view dynamically
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Operation: Update Task
  const updateTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent })
      });
      if (response.ok) {
        setEditingId(null);
        fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Operation: Delete Task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-xl bg-[#1e1e1e] rounded-xl p-8 shadow-2xl border border-gray-800">
        <h1 className="text-4xl font-extrabold text-center text-[#00adb5] mb-8 tracking-tight">Task Master</h1>
        
        {/* ADD DATA INPUT INTERACTION CONTAINER */}
        <form onSubmit={addTask} className="flex gap-3 mb-8">
          <input 
            type="text" 
            placeholder="Enter a new task here..." 
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="flex-grow bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00adb5] transition-colors"
          />
          <button type="submit" className="bg-[#00adb5] hover:bg-[#04939a] text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Add Task
          </button>
        </form>

        {/* DATA GRID UI LAYER */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[#00adb5] uppercase text-xs tracking-wider">
                <th className="pb-3 font-semibold">Task</th>
                <th className="pb-3 font-semibold">Added</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#252525] transition-colors group">
                    <td className="py-4 pr-3">
                      {editingId === task.id ? (
                        <input 
                          type="text" 
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="bg-[#333] border border-[#00adb5] rounded px-2 py-1 text-white focus:outline-none w-full"
                        />
                      ) : (
                        <span className="font-medium text-gray-200">{task.content}</span>
                      )}
                    </td>
                    <td className="py-4 text-gray-500 whitespace-nowrap">{task.date_created}</td>
                    <td className="py-4 text-right whitespace-nowrap space-x-2">
                      {editingId === task.id ? (
                        <>
                          <button onClick={() => updateTask(task.id)} className="text-emerald-400 hover:text-emerald-500 font-semibold px-2 py-1 bg-emerald-950/30 rounded border border-emerald-900/50">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300 font-semibold px-2 py-1 bg-gray-900 rounded border border-gray-800">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => { setEditingId(task.id); setEditingContent(task.content); }}
                            className="text-[#00adb5] hover:text-[#04939a] bg-cyan-950/20 px-2 py-1 rounded border border-cyan-900/30 transition-colors"
                          >
                            Update
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-500 bg-red-950/20 px-2 py-1 rounded border border-red-900/30 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-600 italic">
                    No tasks found. Create one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}