import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const ReceivedInheritance = (props: any) => {
    useEffect(() => {
        document.body.className = "des_13";
    });
    return (
        <section className="block_1">
            <div className="container">
                <div className="bl_1_1">
                    <nav>
                        <ul>
                            <li><a href="#">About company</a></li>
                            <li><a href="#">Аbout the project</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contacts</a></li>
                        </ul>
                    </nav>
                    <div className="right_info">
                        <div className="connect">
                            Connect Wallet
                        </div>
                    </div>
                </div>
                <div className="bl_1_2">
                    <h1>Your inheritance<br /> has been received</h1>
                </div>
            </div>
        </section>
    );
}

export default connect(null, {})(ReceivedInheritance);
