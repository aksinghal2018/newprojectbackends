import { put,delay,takeEvery,all } from "redux-saga/effects";
function * fetchpost(){
    yield put({
        type:"start"
    })
    const json= yield fetch("https://jsonplaceholder.typicode.com/posts").then(
        res=>res.json()
    )
    yield delay(2000);
    yield put({
        type:"POSTS_RECEIVED",payload:json
    })
}
function * AsyncInc(){
    //yield delay(1000)
    yield put({type:"INC",payload:1})

}
function * AsyncDec(){
    //yield delay(1000)
    yield put({type:"DEC",payload:1})

}
function * fetchuser(){
    const data=yield fetch("http://localhost:3001/user").then(
        res=>res.json()
    )
    console.log(data)
}
function * watcher(){
    yield takeEvery('GET_POSTS',fetchpost)
    yield takeEvery('Inc_count',AsyncInc)
    yield takeEvery('Dec_count',AsyncDec)
}
export default   function  * Sagafunction() {
    yield all([
        watcher()
    ]

    )
}


