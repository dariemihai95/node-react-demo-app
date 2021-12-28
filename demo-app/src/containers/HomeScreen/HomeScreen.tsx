import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITask } from '../../openapi/api';
import { getTaskList, postCreateTask } from '../../services/axiosService';

const keyList = ['name', 'description', 'dueDate', 'status']

const HomeScreen = ({ jwtToken, setJwtToken }: { jwtToken: string, setJwtToken: (payload: string) => void }) => {
  let navigate = useNavigate();

  const defaultPageSize = 3

  const [loadedPages, setLoadedPages] = useState(1);
  const [selectedToOrder, setSelectedToOrder] = useState<{ index: undefined | number, ascending: boolean }>({ index: undefined, ascending: true });
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [taskData, setTaskData] = useState({ name: '', description: '', dueDate: `${new Date()}`, status: 'ToDo', tags: '' })

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const loadedTask: ITask | string = await postCreateTask(taskData, jwtToken);
    if (typeof loadedTask !== 'string') {
      if (loadedPages * defaultPageSize <= taskList.length) {
        setLoadedPages(loadedPages + 1);
      }
      setTaskList([...taskList, loadedTask]);
    } else {
      if (loadedTask.includes('401')) {
        setJwtToken('');
        navigate("/login", { replace: true });
      }
    }
  }

  const handleListOrder = async (index: number) => {
    setSelectedToOrder({ index: index, ascending: !selectedToOrder.ascending })
    const loadedTaskList = await getTaskList({ pageNumber: 1, pageSize: defaultPageSize, order: selectedToOrder.ascending ? 'DESC' : 'ASC', sortBy: keyList[index] }, jwtToken);
    setLoadedPages(1);
    if (typeof loadedTaskList !== 'string') {
      setTaskList(loadedTaskList);
    } else {
      if (loadedTaskList.includes('401')) {
        setJwtToken('');
        navigate("/login", { replace: true });
      }
    }
  }

  const refreshList = async (event: any) => {
    event.preventDefault();
    setLoadedPages(1);
    setSelectedToOrder({ index: undefined, ascending: true });
    const loadedTaskList: ITask[] | string = await getTaskList({ pageNumber: 1, pageSize: defaultPageSize }, jwtToken);
    if (typeof loadedTaskList !== 'string') {
      setTaskList(loadedTaskList);
    } else {
      if (loadedTaskList.includes('401')) {
        setJwtToken('');
        navigate("/login", { replace: true });
      }
    }
  }

  const logout = async (event: any) => {
    setLoadedPages(1)
    setSelectedToOrder({ index: undefined, ascending: true });
    setTaskList([]);
    setJwtToken('');
    navigate("/login", { replace: true });
  }

  const handleChange = (event: any) => {
    setTaskData({ ...taskData, [event.target.name]: event.target.value });
  }

  const loadMoreItems = async () => {
    if (loadedPages * defaultPageSize <= taskList.length) {
      let loadedTaskList: ITask[] | string = [];
      if (selectedToOrder.index === undefined) {
        loadedTaskList = await getTaskList({ pageNumber: loadedPages + 1, pageSize: defaultPageSize }, jwtToken);
      } else {
        loadedTaskList = await getTaskList({ pageNumber: loadedPages + 1, pageSize: defaultPageSize, order: selectedToOrder.ascending ? 'ASC' : 'DESC', sortBy: keyList[selectedToOrder.index] }, jwtToken);
      }
      if (typeof loadedTaskList !== 'string') {
        setTaskList([...taskList, ...loadedTaskList]);
        setLoadedPages(loadedPages + 1);
      } else {
        if (loadedTaskList.includes('401')) {
          setJwtToken('');
          navigate("/login", { replace: true });
        }
      }
    }
  }

  useEffect(() => {
    const setTasks = async () => {
      const loadedTaskList: ITask[] | string = await getTaskList({ pageNumber: 1, pageSize: defaultPageSize }, jwtToken);
      if (typeof loadedTaskList !== 'string' && jwtToken) {
        setTaskList(loadedTaskList);
      } else {
        setJwtToken('');
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
      >
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h3 style={{ width: 110 }}>Name<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(0)}>{selectedToOrder.index === 0 ? (selectedToOrder.ascending ? '\u2191' : '\u2193') : '-'}</a></h3>
          <h3 style={{ width: 110 }}>Description<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(1)}>{selectedToOrder.index === 1 ? (selectedToOrder.ascending ? '\u2191' : '\u2193') : '-'}</a></h3>
          <h3 style={{ width: 110 }}>Due Date<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(2)}>{selectedToOrder.index === 2 ? (selectedToOrder.ascending ? '\u2191' : '\u2193') : '-'}</a></h3>
          <h3 style={{ width: 110 }}>Status<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(3)}>{selectedToOrder.index === 3 ? (selectedToOrder.ascending ? '\u2191' : '\u2193') : '-'}</a></h3>
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
          <select style={{ width: 110 }} name="status" id="status" onChange={handleChange} value={taskData.status}>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            style={{ width: 110 }}
            type="text"
            name="tags"
            onChange={handleChange}
            value={taskData.tags}
          />
          <input style={{ width: 40 }} type="submit" value="Add" />
        </form>
        {taskList.map((item: ITask, index: number) => (
          <div style={{ display: 'flex', justifyContent: 'space-around' }} key={index}>
            <label style={{ width: 110 }}>{item.name}</label>
            <label style={{ width: 110 }}>{item.description}</label>
            <label style={{ width: 110 }}>{item.dueDate}</label>
            <label style={{ width: 110 }}>{item.status}</label>
            <label style={{ width: 110 }}>{item.tags}</label>
            <div style={{ width: 40 }} />
          </div>
        ))}
      </div>
      <button onClick={loadMoreItems}>
        Load more items...
      </button>
      <button onClick={refreshList}>
        Refresh...
      </button>
    </div>
  );
}

export default HomeScreen;