/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITask } from '../../openapi/api';
import { getTaskList, postCreateTask, putUpdateTask } from '../../services/axiosService';

const keyList = ['name', 'description', 'dueDate', 'status']

const initialState = { name: '', description: '', dueDate: `${new Date()}`, status: 'ToDo', tags: '' }

const InputRowTask = ({ handleForm, handleChange, taskData, onChangeTags, submitButtonName, editTheme }: { handleForm: any, handleChange: any, taskData: ITask, onChangeTags: any, submitButtonName?: string, editTheme?: boolean }) => (
  <form
    style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
    onSubmit={handleForm}
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
      placeholder='yyyy-MM-dd'
      pattern="\d{4}-\d{2}-\d{2}"
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
    <input style={{ width: 40, color: 'white', height: 20, borderRadius: 20, borderWidth: 0, backgroundImage: editTheme ? 'linear-gradient(to right, #41B3A3 , #C38D9E)' : 'linear-gradient(to right, #E27D60 , #C38D9E)', cursor: 'pointer' }} type="submit" value={submitButtonName ? submitButtonName : 'Add'} />
  </form>
)

const HomeScreen = ({ jwtToken, setJwtToken }: { jwtToken: string, setJwtToken: (payload: string) => void }) => {
  let navigate = useNavigate();

  const defaultPageSize = 3

  const [loadedPages, setLoadedPages] = useState(1);
  const [selectedToOrder, setSelectedToOrder] = useState<{ index: undefined | number, ascending: boolean }>({ index: undefined, ascending: true });
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [taskData, setTaskData] = useState<ITask>(initialState);
  const [editTaskData, setEditTaskData] = useState<ITask>(initialState);
  const [editItemIndex, setEditItemIndex] = useState<number | undefined>(undefined);

  // const onSetEditItemIndex = (index: number | undefined) => {
  //   setEditItemIndex(index);
  //   if (typeof index === 'number') {
  //     setEditTaskData(taskList[index]);
  //   } else {
  //     setEditTaskData(initialState)
  //   }
  // }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const loadedTask: ITask | string = await postCreateTask(taskData, jwtToken);
    if (typeof loadedTask !== 'string') {
      if (loadedPages * defaultPageSize <= taskList.length) {
        setLoadedPages(loadedPages + 1);
      }
      setTaskList([...taskList, loadedTask]);
      setTaskData(initialState)
    } else {
      if (loadedTask.includes('401')) {
        setJwtToken('');
        navigate("/login", { replace: true });
      }
    }
  }

  const handleEdit = async (event: any, index?: number) => {
    event.preventDefault();
    // console.warn(event)
    const loadedTask: ITask | string = await putUpdateTask(taskData, jwtToken);
    if (typeof loadedTask !== 'string') {
      if (typeof index === 'number') {
        const newList = taskList.splice(index, index, loadedTask);
        setTaskList(newList);
      }
    } else {
      if (loadedTask.includes('401')) {
        setJwtToken('');
        navigate("/login", { replace: true });
      }
    }
    //   if (loadedPages * defaultPageSize <= taskList.length) {
    //     setLoadedPages(loadedPages + 1);
    //   }
    //   setTaskList([...taskList, loadedTask]);
    //   setTaskData(initialState)
    // } else {
    //   if (loadedTask.includes('401')) {
    //     setJwtToken('');
    //     navigate("/login", { replace: true });
    //   }
    // }
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
    setEditItemIndex(undefined);
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
      ...taskData, tags: event.target.value
        .replace(/[&/\\# +()$~%.'":*?<>{}^@!-]/g, ',')
        .replace(',,', ',')
    });
  }

  const logout = async (event: any) => {
    setLoadedPages(1)
    setSelectedToOrder({ index: undefined, ascending: true });
    setTaskList([]);
    setJwtToken('');
    navigate("/login", { replace: true });
  }

  const handleEditChange = (event: any) => {
    // typeof editItemIndex === 'number' && setEditItemIndex(undefined);
    setEditTaskData({ ...editTaskData, [event.target.name]: event.target.value });
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
        <InputRowTask handleForm={handleSubmit} handleChange={handleChange} taskData={taskData} onChangeTags={onChangeTags} />
        {taskList.map((item: ITask, index: number) => {
          return editItemIndex === index ?
            (
              <div key={index}>
                <InputRowTask handleForm={handleEdit} handleChange={handleEditChange} taskData={editTaskData} onChangeTags={onChangeTags} submitButtonName='Done' editTheme />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#767676', marginTop: 10 }} key={index}>
                <label style={{ width: 110, display: 'flex' }}>{item.name}</label>
                <label style={{ width: 110, display: 'flex' }}>{item.description}</label>
                <label style={{ width: 110, display: 'flex' }}>{item.dueDate}</label>
                <label style={{ width: 110, display: 'flex' }}>{item.status === 'ToDo' ? 'To Do' : item.status === 'InProgress' ? 'In Progress' : item.status}</label>
                <label style={{ width: 110, display: 'flex' }}>{item.tags}</label>
                <a onClick={() => setEditItemIndex(index)} style={{ width: 40, cursor: 'pointer' }}>...</a>
              </div>
            )
        })}
      </div>
      <button style={{
        marginTop: 30, color: 'white', width: 200, height: 30, borderRadius: 20, borderWidth: 0, backgroundImage: 'linear-gradient(to right, #41B3A3, #E8A87C)', cursor: 'pointer'
      }} onClick={loadMoreItems}>
        Load more items...
      </button>
    </div>
  );
}

export default HomeScreen;