import { useEffect, useMemo, useState } from 'react'
import SearchBar from './SearchBar'
import { Card, CardContent, Typography } from '@mui/material'

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <h1>Job list</h1>
        <SearchBar initValue={searchValue} onChange={handleSearchValue} />
        {filteredJobs.map((job) => (
          <Card key={job.id} className="min-h-full">
            <CardContent>
              <Typography variant="h4" component="div" className="mb-2">
                {job.name}
              </Typography>
              <Typography variant="h5" component="div" className="mb-2">
                {getTagValue(job, 'company')}
              </Typography>
              <Typography variant="h6" component="div" className="mb-2">
                {getTagValue(job, 'category')}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" className="mb-2">
                {job.location?.text} - {getTagValue(job, 'type')}
              </Typography>
              <Typography variant="h6" component="div" className="mb-2">
                {job.skills.map(tag => tag.name).join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {job.summary || 'No job description available :('}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {meta &&
          <footer>
            <div>{filteredJobs.length} out of {meta.count} results</div>
            <div>Page {meta.page}</div>
          </footer>}
      </div>
    </div>
  )
}

export default JobList
