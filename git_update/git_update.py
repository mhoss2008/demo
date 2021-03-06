"""template for python scripts"""
from datetime import datetime
import git
MODE = "debug"



def main():
    '''
    script to daily pull an updated repo
    use git reset --hard if the repo is out of sync
    '''
    repo = git.Repo("~/Git/demo")  # ex. "/User/some_user/some_dir"
    o = repo.remotes.origin
    print (o)
    fetch_data = o.fetch()
    print (fetch_data)
    pulled_data = o.pull()
    print (pulled_data)
    print("test11")


def clear_log():
    """clear log file"""
    if MODE == "debug":
        log_line = f"start {str(datetime.today())} \n\n"
        with open("temp/log.txt", "w", encoding="latin-1") as myfile:
            myfile.write(log_line)
    return ()


def log(write_line):
    """write to the log file"""
    if MODE == "debug":
        with open("temp/log.txt", "a", encoding="latin-1") as myfile:
            myfile.write(write_line)
    return ()


if __name__ == "__main__":
    main()
