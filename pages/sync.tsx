import type { NextPage } from 'next'
import api from '../services/api'

const Synced: NextPage = () => {
    api.sync();
    return (<></>)
}   

export default Synced
  