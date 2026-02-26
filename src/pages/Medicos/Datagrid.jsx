import Table from 'react-bootstrap/Table';

function Datagrid({data=[], columns=[]}) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {
                    columns.map((columna, index) => <th key={index}>{columna}</th>)
                    }

                </tr>
            </thead>
            <tbody>
                {
                        (data.length == 0) ? <tr>
                            <td colSpan={columns.length}>No hay datos</td>
                            </tr> :
                        data.map((fila, index) => <tr key={index}>{
                            fila.map((campo, index) => <td key={index}>{campo}</td>)
                            }</tr>)
                    }
            </tbody>
        </Table>
        )
}
export default Datagrid;