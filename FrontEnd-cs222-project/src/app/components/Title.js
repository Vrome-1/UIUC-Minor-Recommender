import React from 'react'



function Title() {
    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.title}>UIUC Minor Recommender</h1>
            </header>
            
        </>
    );

}

const styles = {
    header: {
        backgroundColor: '#FF5F05',
        color: 'black',
        padding: '10px 20px',
        textAlign: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',

    },
    title: {
        color: 'black',
        fontSize: '2.5rem',
        margin: '0',
        fontWeight: 'bold',
        fontFamily: 'Merriweather, sans-serif',
        letterSpacing: '1.5px',
    },
};

export default Title;