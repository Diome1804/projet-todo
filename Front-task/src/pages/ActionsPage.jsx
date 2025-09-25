import React, { useState, useEffect } from 'react';

const actionsData = [
  { id: 1, action: 'Created', user: 'Emily Carter', task: 'Design Mockups', timestamp: '2024-01-15 10:00' },
  { id: 2, action: 'Updated', user: 'David Lee', task: 'Project Plan', timestamp: '2024-01-15 11:30' },
  { id: 3, action: 'Deleted', user: 'Sarah Chen', task: 'Meeting Notes', timestamp: '2024-01-15 12:45' },
  { id: 4, action: 'Created', user: 'Michael Brown', task: 'User Research', timestamp: '2024-01-15 14:00' },
  { id: 5, action: 'Updated', user: 'Jessica Wilson', task: 'Development Plan', timestamp: '2024-01-15 15:15' },
  { id: 6, action: 'Deleted', user: 'Robert Green', task: 'Marketing Strategy', timestamp: '2024-01-15 16:30' },
  { id: 7, action: 'Created', user: 'Olivia Taylor', task: 'Content Calendar', timestamp: '2024-01-15 17:45' },
  { id: 8, action: 'Updated', user: 'William Clark', task: 'Sales Forecast', timestamp: '2024-01-15 19:00' },
  { id: 9, action: 'Deleted', user: 'Sophia Rodriguez', task: 'Customer Feedback', timestamp: '2024-01-15 20:15' },
  { id: 10, action: 'Created', user: 'Ethan Walker', task: 'Budget Proposal', timestamp: '2024-01-15 21:30' },
];

const ActionsPage = () => {
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterTask, setFilterTask] = useState('');

  useEffect(() => {
    // Désactiver le scroll quand le composant est monté
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Réactiver le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const filteredActions = actionsData.filter((item) => {
    return (
      (filterAction === '' || item.action.toLowerCase().includes(filterAction.toLowerCase())) &&
      (filterUser === '' || item.user.toLowerCase().includes(filterUser.toLowerCase())) &&
      (filterTask === '' || item.task.toLowerCase().includes(filterTask.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
        {/* <h1 className="text-2xl font-bold mb-6 text-emerald-700">Global Actions</h1> */}
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Action Type"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="User"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Task"
            value={filterTask}
            onChange={(e) => setFilterTask(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-emerald-100 text-left text-sm font-semibold text-emerald-700">
              <th className="p-3 border-b border-emerald-300">ACTION</th>
              <th className="p-3 border-b border-emerald-300">USER</th>
              <th className="p-3 border-b border-emerald-300">TASK</th>
              <th className="p-3 border-b border-emerald-300">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.map(({ id, action, user, task, timestamp }) => (
              <tr key={id} className="border-b border-emerald-200 hover:bg-emerald-50">
                <td className="p-3">{action}</td>
                <td className="p-3">{user}</td>
                <td className="p-3">{task}</td>
                <td className="p-3">{timestamp}</td>
              </tr>
            ))}
            {filteredActions.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No actions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionsPage;
