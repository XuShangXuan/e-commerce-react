import React, { createContext } from 'react'

const BackEndContext = createContext({
    managerInfo: {},
    setManagerInfo: () => { }
})

export default BackEndContext
