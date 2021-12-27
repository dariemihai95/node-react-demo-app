import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITask } from '../../openapi/api';
import { getTaskList } from '../../services/axiosService';
import { removeAuthToken } from '../../utils/authManager';
import { sleep } from '../../utils/validators';

const HomeScreen = () => {
  let navigate = useNavigate();

  const defaultPageSize = 3

  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [taskData, setTaskData] = useState({ name: '', description: '', dueDate: new Date(), status: 'ToDo', tags: [] })

  const handleSubmit = async (event: any) => {

  }

  const logout = async (event: any) => {
    removeAuthToken();
    navigate("/login", { replace: true });
  }

  const handleChange = (event: any) => {
    setTaskData({ ...taskData, [event.target.name]: event.target.value });
  }

  const loadMoreItems = async (event: any) => {
    const loadedTaskList: ITask[] | string = await getTaskList({ pageNumber: Math.round((taskList.length + defaultPageSize)) / defaultPageSize, pageSize: defaultPageSize });
    if (typeof loadedTaskList !== 'string') {
      setTaskList([...taskList, ...loadedTaskList]);
    } else {
      // removeAuthToken();
      // navigate("/login", { replace: true });
    }
  }

  useEffect(() => {
    const setTasks = async () => {
      const jwt = localStorage.getItem('jwt');
      await sleep(0.5)
      const loadedTaskList: ITask[] | string = await getTaskList({ pageNumber: 1, pageSize: defaultPageSize });
      if (typeof loadedTaskList !== 'string' && jwt) {
        setTaskList(loadedTaskList);
      } else {
        removeAuthToken();
        navigate("/login", { replace: true });
      }
    }
    setTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <label>Hello to homescreen</label>
      <button onClick={logout}>
        Logout
      </button>
      <div
      // style={{display: 'flex'}}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h3 style={{ width: 110 }}>Name</h3>
          <h3 style={{ width: 110 }}>Description</h3>
          <h3 style={{ width: 110 }}>Due Date</h3>
          <h3 style={{ width: 110 }}>Status</h3>
          <h3 style={{ width: 110 }}>Tags</h3>
          <div style={{ width: 40 }} />
        </div>
        <form
          style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <input
            style={{ width: 110 }}
            type="text"
            name="name"
            onChange={handleChange}
            value={taskData.name}
          />
          <input
            style={{ width: 110 }}
            type="text"
            name="description"
            onChange={handleChange}
            value={taskData.description}
          />
          <input
            style={{ width: 110 }}
            type="date"
            name="dueDate"
            onChange={handleChange}
            value={`${taskData.dueDate}`}
          />
          <select style={{ width: 110 }} name="status" id="status">
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            style={{ width: 110 }}
            type="text"
            name="tags"
          // onChange={handleChange}
          // value={accountData.description}
          />
          <input style={{ width: 40 }} type="submit" value="Add" />
        </form>
        {taskList.map((item: ITask, index: number) => (
          <div key={index}>
            <h2>Name: {item.name}</h2>
            <h2>Description: {item.description}</h2>
            <h2>Due Date: {item.dueDate}</h2>
            <h2>Status: {item.status}</h2>
          </div>
        ))}
      </div>
      {/* <Link to="/register">Register</Link> */}
      <button onClick={loadMoreItems}>
        Load more items...
      </button>
    </div>
  );
}

export default HomeScreen;