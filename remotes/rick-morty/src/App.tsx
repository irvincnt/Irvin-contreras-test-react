import React, { useState, useEffect } from 'react';
import moment from 'moment';
import AuthGuard from './components/AuthGuard';
import './index.css';
import {
  ApiResponse,
  Character,
  SortConfig,
  SortDirection,
  SortIconProps,
  SortKey,
} from './interfaces';
import { getCharacters } from './services';

function App(): React.ReactElement {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const fetchCharacters = async (pageNum: number): Promise<void> => {
    setLoading(true);
    try {
      const data: ApiResponse = await getCharacters(pageNum);
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey): void => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCharacters = React.useMemo(() => {
    const sortableCharacters: Character[] = [...characters];
    if (sortConfig.key !== null) {
      sortableCharacters.sort((a: Character, b: Character) => {
        let aValue: string | number | Date;
        let bValue: string | number | Date;

        switch (sortConfig.key) {
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'species':
            aValue = a.species.toLowerCase();
            bValue = b.species.toLowerCase();
            break;
          case 'gender':
            aValue = a.gender.toLowerCase();
            bValue = b.gender.toLowerCase();
            break;
          case 'created':
            aValue = new Date(a.created);
            bValue = new Date(b.created);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCharacters;
  }, [characters, sortConfig]);

  const renderPageNumbers = (): React.ReactElement[] => {
    const pageNumbers: React.ReactElement[] = [];
    const maxVisible: number = 5;
    let startPage: number = Math.max(1, page - 2);
    let endPage: number = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.push(
          <span key="dots-start" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition-all border ${
            page === i
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="dots-end" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    return pageNumbers;
  };

  const SortIcon = ({ columnKey }: SortIconProps): React.ReactElement => {
    if (sortConfig.key !== columnKey) {
      return (
        <span className="ml-1 inline-flex opacity-0 group-hover:opacity-40">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    return (
      <span className="ml-1 inline-flex opacity-60">
        {sortConfig.direction === 'asc' ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-app p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className=" p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">Rick & Morty Characters</h1>
            <p className="text-gray-800 mt-1">Explora los personajes del universo de Rick & Morty</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-light overflow-hidden">
            <div className="grid grid-cols-[60px_60px_1fr_140px_100px_130px] gap-6 px-6 py-4 bg-gray-50/50 border-b border-light">
              <div 
                className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:text-gray-700 transition-colors select-none"
                onClick={() => handleSort('id')}
              >
                ID
                <SortIcon columnKey="id" />
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                
              </div>
              <div 
                className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:text-gray-700 transition-colors select-none"
                onClick={() => handleSort('name')}
              >
                Nombre
                <SortIcon columnKey="name" />
              </div>
              <div 
                className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:text-gray-700 transition-colors select-none"
                onClick={() => handleSort('species')}
              >
                Especie
                <SortIcon columnKey="species" />
              </div>
              <div 
                className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:text-gray-700 transition-colors select-none"
                onClick={() => handleSort('gender')}
              >
                Género
                <SortIcon columnKey="gender" />
              </div>
              <div 
                className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group hover:text-gray-700 transition-colors select-none"
                onClick={() => handleSort('created')}
              >
                Fecha
                <SortIcon columnKey="created" />
              </div>
            </div>

            <div>
              {sortedCharacters.map((character: Character, index: number) => (
                <div
                  key={character.id}
                  className={`grid grid-cols-[60px_60px_1fr_140px_100px_130px] gap-6 px-6 py-4 hover:bg-hover transition-all duration-150 cursor-pointer ${
                    index !== sortedCharacters.length - 1 ? 'border-b border-light' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {character.id}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-100"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {character.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {character.origin.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                      {character.species}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                      character.gender === 'Male' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : character.gender === 'Female'
                        ? 'bg-pink-50 text-pink-700 border-pink-100'
                        : 'bg-gray-50 text-gray-700 border-gray-100'
                    }`}>
                      {character.gender}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    {moment(character.created).format('DD/MM/YYYY')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-light px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 font-medium">
                Mostrando página <span className="text-gray-900 font-semibold">{page}</span> de <span className="text-gray-900 font-semibold">{totalPages}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  title="Primera página"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  title="Página anterior"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center space-x-1">
                  {renderPageNumbers()}
                </div>
                <button
                  onClick={() => setPage((prev: number) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  title="Página siguiente"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  title="Última página"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;

