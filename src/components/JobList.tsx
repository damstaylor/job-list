import { useEffect, useMemo, useState } from 'react'
import SearchBar from './SearchBar'

interface Job {
  id: number
  key: string
  reference: string | null
  board: {
    key: string
    name: string
    type: string
    subtype: string
    environment: string
  }
  board_key: string
  name: string
  url: string | null
  picture: null
  summary: string
  location: {
    text: string
    lat: number
    lng: number
    gmaps: null
    fields: []
  }
  archive: null
  archived_at: null
  updated_at: string
  created_at: string
  sections: []
  culture: null
  responsibilities: null
  requirements: null
  benefits: null
  interviews: null
  skills: {
    name: string
    value: null
    type: null
  }[]
  languages: {
    name: string
    value: null
  }[]
  certifications: {
    name: string
    value: null
    type: null
  }[]
  courses: []
  tasks: {
    name: string
    value: null
    type: null
  }[]
  interests: []
  tags: {
    name: string
    value: string
  }[]
  metadatas: []
  ranges_float: []
  ranges_date: {
    name: string
    value_min: string
    value_max: string
  }[]
}
interface Meta {
  count: number
  maxPage: number
  page: number
  total: number
}

const JobList: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const getTagValue = (job: Job, tagName: string) => {
    const tag = job.tags?.find((tag) => tag.name.toLowerCase() === tagName)
    return tag?.value ?? ''
  }
  const handleSearchValue = (newValue: string) => {
    setSearchValue(newValue)
  }
  const filteredJobs = useMemo(() => {
    const lowerSearchValue = searchValue.toLowerCase()
    return searchValue !== '' ? jobs.filter(job => job.name.toLowerCase().includes(lowerSearchValue)) : jobs
  }, [searchValue, jobs])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { REACT_APP_API_KEY, REACT_APP_BASE_URL, REACT_APP_BOARD_KEYS } = process.env
        const sortOrder: string = 'desc'
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': REACT_APP_API_KEY,
          },
        } as RequestInit
        const url: string = `${REACT_APP_BASE_URL}/jobs/searching?page=1&limit=30&order_by=${sortOrder}&board_keys=${REACT_APP_BOARD_KEYS}`
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
          setJobs(data.data.jobs)
          setMeta(data.meta)
        } else {
          console.error(`Request error: ${data.message}`)
        }
      } catch (error) {
        console.error('Error while fetching data', error)
      }
    }
    fetchData()
  }, [])
  return (
    <div className="job-list">
      <h1>Job list</h1>
      <SearchBar initValue={searchValue} onChange={handleSearchValue} />
      <ul>
        {filteredJobs.map((job) => (
          <li key={job.id}>
            <h2>{job.name}</h2>
            <h3>{getTagValue(job, 'company')}</h3>
            <i>{getTagValue(job, 'category')}</i>
            <h4>{job.location?.text} - {getTagValue(job, 'type')}</h4>
            <h5>{job.skills.map(tag => tag.name).join(', ')}</h5>
            <p>{job.summary || 'No job description available :('}</p>
            <br />
          </li>
        ))}
      </ul>
      {meta &&
        <footer>
          <div>{meta.count} results</div>
          <div>Page {meta.page}</div>
        </footer>}
    </div>
  )
}

export default JobList
