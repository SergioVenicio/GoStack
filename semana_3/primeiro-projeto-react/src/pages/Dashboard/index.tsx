import React, { useState, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

import api from "../../services/api";

import { DashboardTitle, Form, Repositories, Error } from "./styles";

import logo from "../../assets/images/logo.svg";

interface Repository {
  id: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Dashboard: React.FC = () => {
  const [newRepository, setNewRepository] = useState("");
  const [inputError, setInputError] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const localRepos = localStorage.getItem("repositories");

    if (!localRepos) {
      return [];
    }

    return JSON.parse(localRepos);
  });

  const handleAddRepository = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!newRepository) {
      setInputError("Digite o autor/nome do repositório!");
      return;
    }

    try {
      const { data } = await api.get(`/repos/${newRepository}`);
      setInputError("");
      setRepositories((repositories) => [...repositories, { ...data }]);
    } catch (e) {
      setInputError("Repositório não encontrado!");
      console.error(e);
    }

    setNewRepository("");
  };

  const renderRepositories = () =>
    repositories.map(({ id, full_name, description, owner }: Repository) => (
      <Link to={`/repository/${full_name}`} key={id}>
        <img src={owner.avatar_url} alt={owner.login} />

        <div>
          <strong>{full_name}</strong>
          <p>{description}</p>
        </div>

        <FiChevronRight size={20} />
      </Link>
    ));

  useEffect(() => {
    localStorage.setItem("repositories", JSON.stringify(repositories));
  }, [repositories]);

  return (
    <>
      <img src={logo} alt="Github explorer" />

      <DashboardTitle>Dashboard</DashboardTitle>
      <Form onSubmit={handleAddRepository} hasError={!!inputError}>
        <input
          type="text"
          placeholder="Digite o nome do repositório"
          value={newRepository}
          onChange={(e) => setNewRepository(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && (
        <Error onClick={() => setInputError("")}>{inputError}</Error>
      )}

      <Repositories>{renderRepositories()}</Repositories>
    </>
  );
};

export default Dashboard;
