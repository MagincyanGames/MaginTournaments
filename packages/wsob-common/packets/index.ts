export default interface IWSOBPacket {
    /*
     * GET, C -> S
     * [ADMIN] SET, C -> S
     * [ADMIN] MAKE, C -> S: make a new object 
     * OK, S -> C: if the request was successfuly
     * UPDATE, S -> Cs
    */
    type: 'GET'     //* [     ]  C -> S
    | 'SET'         //* [ADMIN] C -> S
    | 'MAKE'        //* [ADMIN] C -> S
    | 'OK'          //* [     ] S -> C
    | 'ERROR'       //* [     ] S -> C
    | 'UPDATE'      //* [     ] S -> C

    key: string
    payload?: any
}