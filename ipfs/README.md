glpat-BzefZzGNx-Jyydiw-Sob
# IPFS Cluster Private Network
To setup a new IFPS Cluster private network you need to chose one of the nodes to be the **bootstrap node**. This ensures that all other peers can find each other through this node.

**Setup the environment on each peer and bootstrap node**:

1. Download the [docker-compose.yml](https://code.nap.av.it.pt/mobility-networks/ipfs-cluster/-/blob/main/docker-compose.yml) file from the repository and store it in a new folder `ipfs`
2.  Create a virtual environment (`.env` file) in that folder with the following content:
		`ipfsname=<name_of_your_ipfs_container>`<br/>`clustername=<name_of_your_cluster container>`<br/>`sharedkey=<cluster_secret>`
3. Inside the `ifps` folder, create a new folder called `shared`
4. Inside this folder place the [ipfs-bootstrap.sh](https://code.nap.av.it.pt/mobility-networks/ipfs-cluster/-/blob/main/shared/ipfs-bootstrap.sh) and [entrypoint-cluster.sh](https://code.nap.av.it.pt/mobility-networks/ipfs-cluster/-/blob/main/shared/entrypoint-cluster.sh) files (make sure they have the necessary permissions).
	**Note:** Don't forget to change the **ip address** and the **ipfs-peer-id / cluster-peer-id**  in both files to the ones of your bootstrap node. To find out these values, start both the containers without any entrypoints set in the [docker-compose.yml](https://code.nap.av.it.pt/mobility-networks/ipfs-cluster/-/blob/main/docker-compose.yml). Inside the **ipfs container** run the command `ipfs id` to find the **ipfs-peer-id** of the bootstrap node. Do the same inside the **cluster container** with the command `ipfs-cluster-ctl id` to find the **cluster-peer-id**
5. After setting everything up, start only the **ipfs container** by running `docker-compose up -d ifps`, wait a couple of seconds and then stop it with `docker stop <container name>`
6. A new folder `compose` was generated. Inside it, edit the file **/ipfs/<ipfs_container>/config**, changing the line `"API": "/ip4/127.0.0.1/tcp/5001"` to `"API": "/ip4/0.0.0.0/tcp/5001"` and the line `"Gateway": "/ip4/127.0.0.1/tcp/8080"` to `"Gateway": "/ip4/0.0.0.0/tcp/8080"`.
7. Start both containers with `docker-compose up -d`. To check the logs, just run `docker logs <container_name>`.

**Generating the CLUSTER_SECRET**:
Open a terminal and run the following command: `od -vN 32 -An -tx1 /dev/urandom | tr -d ' \n'`
Make sure to use this key in all the peers.
