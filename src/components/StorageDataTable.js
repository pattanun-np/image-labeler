import React, {Component} from 'react';
import {Table} from 'reactbulma';

class StorageDataTable extends Component {

    render() {
        let messageNodes = this
            .props
            .rows
            .map((r) => {
                return (
                    <Table.Tr key={r.no + r.name}>
                        <Table.Th>{r.no}</Table.Th>
                        <Table.Th>{r.name}</Table.Th>
                        <Table.Th>{r.fullPath}</Table.Th>
                        <Table.Th>{r.contentType}</Table.Th>
                        <Table.Th>{r.size}

                            B</Table.Th>

                        <Table.Th>

                            <a target="_blank" onClick={(e) => this.props.deleteData(e, r)}>Delete</a>
                        </Table.Th>
                    </Table.Tr>
                )
            });
        return (
            <div>
                <Table
                    border="0.5"
                    className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <Table.Head>
                        <Table.Tr>
                            <Table.Th>No.</Table.Th>
                            <Table.Th>File Name</Table.Th>
                            <Table.Th>fullPath</Table.Th>
                            <Table.Th>File Type</Table.Th>
                            <Table.Th>File Size</Table.Th>
                            <Table.Th>Delete</Table.Th>
                        </Table.Tr>
                    </Table.Head>
                    <Table.Body>
                        {messageNodes}
                    </Table.Body>
                </Table>
                {/* <button id="addBtn" onClick={this.onClick}>ADD</button> */}
            </div>
        );
    }
}

export default StorageDataTable;
