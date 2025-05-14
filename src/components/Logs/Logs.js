import React, { useState } from 'react';
import LogsTable from './LogsTable';
import logsData from '../../mock/logs';

function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  const filteredLogs = logsData.filter(
    log =>
      log.deviceId.includes(search) ||
      log.ip.includes(search) ||
      log.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      log.sensor.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <LogsTable
      logs={paginatedLogs}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      search={search}
      onSearchChange={e => { setSearch(e.target.value); setPage(0); }}
    />
  );
}

export default Logs; 