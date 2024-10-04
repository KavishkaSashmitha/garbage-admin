import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const UserDetails = () => {
    const [userDetails, setUserDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:4000/userDetails');
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const downloadUserDataPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['User ID', 'Name', 'Email', 'Location'];
        const tableRows = userDetails.map(user => [
            truncateId(user.id),
            user.name,
            user.email,
            user.location || 'Not specified', // Fallback for empty location
        ]);

        doc.setFontSize(18);
        doc.text('User Details', 14, 20);
        doc.setFontSize(12);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            styles: {
                fillColor: [40, 167, 69], // Green
                textColor: [255, 255, 255],
                fontSize: 12,
            },
            headStyles: {
                fillColor: [40, 167, 69], // Green
            },
            alternateRowStyles: {
                fillColor: [220, 220, 220],
            },
        });

        // Save the PDF
        doc.save('user_data.pdf');
    };

    const truncateId = (id) => {
        return id.length > 12 ? `${id.substring(0, 12)}...` : id;
    };

    // Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = userDetails.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(userDetails.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div style={styles.container}>
            {/* Download Button */}
            <div style={styles.header}>
                <button style={styles.downloadButton} onClick={downloadUserDataPDF}>
                    Download User Data
                </button>
            </div>

            {/* User Details Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.th}>User ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length > 0 ? (
                            currentRows.map(user => (
                                <tr key={user.id}>
                                    <td style={styles.td}>{truncateId(user.id)}</td>
                                    <td style={styles.td}>{user.name}</td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>{user.location || 'Not specified'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={styles.td}>No user details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div style={styles.pagination}>
                <button 
                    style={styles.pageButton} 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button 
                        key={i + 1} 
                        style={styles.pageButton} 
                        onClick={() => handlePageChange(i + 1)} 
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
                <button 
                    style={styles.pageButton} 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: '"Arial", sans-serif',
        color: '#333',
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
    },
    downloadButton: {
        backgroundColor: '#28a745', // Green theme
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    tableContainer: {
        marginTop: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#28a745', // Green theme
        color: '#fff',
    },
    th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        borderBottom: '2px solid #ddd',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
        color: '#555',
        maxWidth: '200px',
        wordWrap: 'break-word',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    pageButton: {
        margin: '0 5px',
        padding: '10px 15px',
        backgroundColor: '#28a745', // Green theme
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default UserDetails;
