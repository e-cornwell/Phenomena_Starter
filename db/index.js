const pg = require('pg')

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost:5432/phenomena-dev')

/**
 * Report Related Methods
 */

async function getOpenReports() {
  try {
      const { rows: reports } = await client.query(`
        SELECT *
        FROM reports
        WHERE reports."isOpen" = 'true';
      `);
      

      const { rows: comments } = await client.query(`
        SELECT *
        FROM comments
        WHERE "reportId" IN (${
          reports.map(report => report.id).join(', ')
        });
      `)
      reports.forEach(report => {
          report.comments = comments.filter(comment => comment.reportId === report.id); 
          report.isExpired = Date.parse(report.expirationDate) < new Date();
          delete report.password;
        }
      )
      
    return reports;

  } catch (error) {
    throw error;
  }
}

async function createReport(reportFields) {
  const { title, location, description, password } = reportFields;

  try {
    const SQL = `
      INSERT INTO reports(title, location, description, password)
      VALUES($1, $2, $3, $4) 
      RETURNING *
    `;

    const response = await client.query(SQL, [title, location, description, password])
    const report = response.rows[0];
    delete report.password
    return report

  } catch (error) {
    throw error;
  }
}

async function _getReport(reportId) {
  try {
    const { rows: [report] } = await client.query(`
      SELECT *
      FROM reports
      WHERE id=$1
    `, [reportId]);
    
    return report;

  } catch (error) {
    throw error;
  }
}

async function closeReport(reportId, password) {
  try {
    
    const report = await _getReport(reportId);
    
    if (!report) {
      throw Error('Report does not exist with that id');
    }
    
    if (report.password !== password) {
      throw Error('Password incorrect for this report, please try again');
    }
    
    if (!report.isOpen) {
      throw Error('This report has already been closed');
    }
    
    await client.query(`
      UPDATE reports
      SET "isOpen"='false'
      WHERE id=$1;
    `, [reportId]);
    
    return {
      message: 'Report successfully closed!'
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Comment Related Methods
 */

/**
 * If the report is not found, or is closed or expired, throw an error
 * 
 * Otherwise, create a new comment with the correct
 * reportId, and update the expirationDate of the original
 * report to CURRENT_TIMESTAMP + interval '1 day' 
 */
async function createReportComment(reportId, commentFields) {
  // read off the content from the commentFields


  try {
    // grab the report we are going to be commenting on


    // if it wasn't found, throw an error saying so
    

    // if it is not open, throw an error saying so
    

    // if the current date is past the expiration, throw an error saying so
    // you can use Date.parse(report.expirationDate) < new Date() to check
    

    // all go: insert a comment
    

    // then update the expiration date to a day from now
    

    // finally, return the comment
    

  } catch (error) {
    throw error;
  }
}

// export the client and all database functions below
module.exports = {
  client, 
  getOpenReports,
  createReportComment, 
  createReport,
  closeReport,
  _getReport
};
