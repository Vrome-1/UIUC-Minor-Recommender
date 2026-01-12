import React from 'react'

function Subtitle({string}) {
    return (
        <>
            <h2 style={styles.subtitle}> {string} </h2>
        </>
    );

}

const styles = {
    subtitle: {
        backgroundColor: '#FF5F05',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '50px',
        padding: '20px 60px',
        width: 'fit-content',
        color: '#333',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Merriweather, sans-serif',
        marginTop: '50px',
        marginBottom: '50px',
    },
};

export default Subtitle;