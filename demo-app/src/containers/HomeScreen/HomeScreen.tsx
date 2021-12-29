/* eslint-disable jsx-a11y/anchor-is-valid */
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

  const onChangeTags = (event: any) => {
    setTaskData({
      ...taskData, tags: event.target.
        value.replace(/[&\/\\# +()$~%.'":*?<>{}^@!-]/g, ',').replace(',,', ',')
    });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 20 }} />
        <label style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }}>Home</label>
        <a style={{ margin: 10, height: 20, width: 20, textDecoration: 'none', cursor: 'pointer' }} onClick={logout}>
          <img style={{ height: 15 }} alt='logout-logo' src={require('../../assets/images/logout-res.png')} />
        </a>
      </div>
      <div
      >
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h3 style={{ width: 110, fontSize: '14px', fontWeight: '500', textAlign: 'start' }}>Name<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(0)}>{selectedToOrder.index === 0 ? (selectedToOrder.ascending ? '\u2193' : '\u2191') : ' -'}</a></h3>
          <h3 style={{ width: 110, fontSize: '14px', fontWeight: '500', textAlign: 'start' }}>Description<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(1)}>{selectedToOrder.index === 1 ? (selectedToOrder.ascending ? '\u2193' : '\u2191') : ' -'}</a></h3>
          <h3 style={{ width: 110, fontSize: '14px', fontWeight: '500', textAlign: 'start' }}>Due Date<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(2)}>{selectedToOrder.index === 2 ? (selectedToOrder.ascending ? '\u2193' : '\u2191') : ' -'}</a></h3>
          <h3 style={{ width: 110, fontSize: '14px', fontWeight: '500', textAlign: 'start' }}>Status<a style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleListOrder(3)}>{selectedToOrder.index === 3 ? (selectedToOrder.ascending ? '\u2193' : '\u2191') : ' -'}</a></h3>
          <h3 style={{ width: 110, fontSize: '14px', fontWeight: '500', textAlign: 'start' }}>Tags</h3>
          <a style={{ margin: 10, height: 20, width: 20, textDecoration: 'none', cursor: 'pointer' }} onClick={refreshList}>
            <img style={{ height: 18 }} alt='refresh-logo' src={require('../../assets/images/refresh-res.png')} />
          </a>
        </div>
        <form
          style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <input
            style={{ width: 110, borderBottomWidth: 1, paddingBottom: 4, height: 20, borderWidth: 0, outline: 'none' }}
            required
            type="text"
            name="name"
            maxLength={17}
            placeholder='Task name'
            onChange={handleChange}
            value={taskData.name}
          />
          <input
            style={{ width: 110, borderBottomWidth: 1, paddingBottom: 4, height: 20, borderWidth: 0, outline: 'none', position: 'relative', left: -3 }}
            required
            maxLength={17}
            type="text"
            name="description"
            placeholder='Task description'
            onChange={handleChange}
            value={taskData.description}
          />
          <input
            style={{ width: 110, borderBottomWidth: 1, paddingBottom: 4, height: 20, borderWidth: 0, outline: 'none', color: '#767676', backgroundColor: 'white', position: 'relative', left: -6 }}
            required
            type="date"
            name="dueDate"
            placeholder='yyy.mm.dd'
            onChange={handleChange}
            value={`${taskData.dueDate}`}
          />
          <select required style={{ width: 110, borderBottomWidth: 1, paddingBottom: 4, height: 20, borderWidth: 0, outline: 'none', color: '#767676', backgroundColor: 'white', position: 'relative', left: -8 }} name="status" id="status" onChange={handleChange} value={taskData.status}>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            style={{ width: 110, borderBottomWidth: 1, paddingBottom: 4, height: 20, borderWidth: 0, outline: 'none' }}
            type="text"
            name="tags"
            maxLength={17}
            placeholder='Optional tags'
            onChange={onChangeTags}
            value={taskData.tags}
          />
          <input style={{ width: 40, color: 'white', height: 20, borderRadius: 20, borderWidth: 0, backgroundImage: 'linear-gradient(to right, #E27D60 , #C38D9E)' }} type="submit" value="Add" />
        </form>
        {taskList.map((item: ITask, index: number) => (
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#767676', marginTop: 10 }} key={index}>
            <label style={{ width: 110, display: 'flex' }}>{item.name}</label>
            <label style={{ width: 110, display: 'flex' }}>{item.description}</label>
            <label style={{ width: 110, display: 'flex' }}>{item.dueDate}</label>
            <label style={{ width: 110, display: 'flex' }}>{item.status}</label>
            <label style={{ width: 110, display: 'flex' }}>{item.tags}</label>
            <div style={{ width: 40 }} />
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 30, color: 'white', width: 200, height: 30, borderRadius: 20, borderWidth: 0, backgroundImage: 'linear-gradient(to right, #41B3A3, #E8A87C)'
      }} onClick={loadMoreItems}>
        Load more items...
      </button>
    </div>
  );
}

export default HomeScreen;