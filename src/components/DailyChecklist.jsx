import { useState } from 'react';
import { Plus, HeartHandshake, CheckCircle2, Heart } from 'lucide-react';

export default function DailyChecklist() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Send morning sweetheart audio note 🎙️", done: true, tag: "Sweet Routine" },
    { id: 2, text: "Pick tonight’s cozy movie or anime 🍿", done: true, tag: "Date Night" },
    { id: 3, text: "Drink 2L of water & remind Pan Pan 💧", done: false, tag: "Self Care" },
    { id: 4, text: "Share 1 song that reminds you of each other 🎶", done: false, tag: "Lofi Vibes" },
    { id: 5, text: "10-minute bedtime gratitude cuddle or call 🌙", done: false, tag: "Deep Bond" },
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTaskText.trim(),
        done: false,
        tag: 'Couple Quest',
      },
    ]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6 border border-pink-200/90 shadow-xl shadow-pink-200/40 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                Daily Couple Quests <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              </h3>
              <p className="text-[11px] text-pink-700/70 font-medium">Sweet routines to keep us smiling</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-600 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completedCount}/{tasks.length} Done</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5 font-semibold">
            <span>Daily Bonding Goal</span>
            <span className="text-pink-600 font-bold">{progressPercent}% 💖</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden border border-pink-200/60">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-pink-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task Items */}
        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                task.done
                  ? 'bg-pink-50/50 border-pink-200/50 text-slate-400'
                  : 'bg-white hover:bg-pink-50/60 border-pink-200 text-slate-700 hover:border-pink-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    task.done
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/40'
                      : 'border-2 border-pink-300 group-hover:border-pink-500'
                  }`}
                >
                  {task.done ? (
                    <span className="text-xs font-black">✓</span>
                  ) : null}
                </button>
                <span
                  className={`text-xs font-semibold transition-all ${
                    task.done ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {task.text}
                </span>
              </div>

              {task.tag && (
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold hidden sm:inline-block ${
                    task.done
                      ? 'bg-pink-100/40 text-slate-400 border-pink-200/50'
                      : 'bg-pink-500/15 text-pink-600 border-pink-400/30'
                  }`}
                >
                  {task.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Input Form */}
      <div className="mt-4 pt-3 border-t border-pink-100">
        {isAdding ? (
          <form onSubmit={handleAddTask} className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="e.g. Surprise Pan Pan with flowers..."
              autoFocus
              className="flex-1 text-xs bg-pink-50/60 text-slate-900 placeholder-pink-400/60 px-3 py-2 rounded-xl border border-pink-300 focus:outline-none focus:border-pink-500 font-medium"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-slate-600 text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/70 border border-dashed border-pink-300 hover:border-pink-400 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Daily Quest 🌸</span>
          </button>
        )}
      </div>
    </div>
  );
}
