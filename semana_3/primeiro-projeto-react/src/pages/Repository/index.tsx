import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Header, Issues, RepositoryInfo, ErrorRepository404 } from "./styles";

import api from "../../services/api";

import logo from "../../assets/images/logo.svg";

interface RepositoryParams {
  repository: string;
}

interface Repository {
  id: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  html_url: string;
  title: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRespository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  const repoInLocalstorage = () => {
    const repos = localStorage.getItem("repositories");
    return Boolean(repos);
  };

  const renderIssues = () =>
    issues.map(({ id, title, html_url, user }: Issue) => (
      <a href={html_url} key={id}>
        <div>
          <strong>{title}</strong>
          <p>{user.login}</p>
        </div>
        <FiChevronRight size={20} />
      </a>
    ));

  useEffect(() => {
    const repos = localStorage.getItem("repositories");

    if (!repos) {
      return;
    }

    const localInfo = JSON.parse(repos).find(
      (repo: Repository) => repo.full_name === params.repository
    );

    setRespository(localInfo);

    api.get(`/repos/${localInfo.full_name}/issues`).then(({ data }) => {
      setIssues(data);
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logo} alt="Github explorer" />
        <Link to="/">
          <FiChevronLeft size={16} /> voltar
        </Link>
      </Header>

      {repoInLocalstorage() ? (
        <RepositoryInfo>
          <header>
            <img src={repository?.owner.avatar_url} alt="" />

            <div>
              <strong>{repository?.full_name}</strong>
              <p>{repository?.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository?.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository?.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository?.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      ) : (
        <ErrorRepository404>
          <h2>Repositório não encontrado!</h2>
          <Link to="/">Voltar</Link>
        </ErrorRepository404>
      )}

      <Issues>{issues && renderIssues()}</Issues>
    </>
  );
};

export default Repository;
