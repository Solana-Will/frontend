import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Header from './Header';

const ReceivedInheritance = (props: any) => {
    useEffect(() => {
        document.body.className = "des_13";
    });
    return (
        <section className="block_1">
            <div className="container">
                <Header/>
                <div className="bl_1_2">
                    <h1>Your inheritance<br /> has been received</h1>
                </div>
            </div>
        </section>
    );
}

export default connect(null, {})(ReceivedInheritance);
